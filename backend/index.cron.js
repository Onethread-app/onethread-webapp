const cron = require('node-cron');
const app = require('./config/express');
const config = require('./config/config');
const nodeMailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const {
  Subscription,
} = require('./server/subscription/subscription.model');
const { Member } = require('./server/company/member/member.model');
const mongoose = require('mongoose');

Promise = require('bluebird');
const loggerDispatcher = 'Index';
//const client = require('./index.redis');
const logger = require('./config/winston');
const { IndexElasticSearch } = require('./index.elasticsearch');

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUri, () => {});
logger.info('MongoDB is connected');
IndexElasticSearch();
console.log('I am starting.....');

const options = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: 'templates',
    layoutsDir: 'templates',
    defaultLayout: false,
  },
  viewPath: 'templates',
};
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.emailAddress,
    pass: config.emailPassword,
  },
});
transporter.use('compile', hbs(options));

cron.schedule('* * * * *', async () => {
  let startDate = new Date().getTime();
  let endDate = new Date().getTime() + 30;
  console.log('process start');
  await Subscription.find({
    expireAt: { $gte: startDate },
    isActive: true,
  })
    .populate('company', '_id')
    .exec()
    .then((result) => {
      result.forEach(async (company) => {
        let emailId = await Member.findOne({
          company: company.company._id,
          role: 'superAdmin',
        }).populate('account', 'email');
        if (emailId.account.email) {
          const mailOptions = {
            from: config.emailAddress, // sender address
            to: emailId.account.email, // list of receivers
            subject: 'Hello there!', // Subject line
            text: 'Renew Your subscription plan', // plain text body
            html: '<b>Renew your Subscription.</b>', // html body
          };
          transporter.sendMail(mailOptions, function (error, info) {
            console.log(info.messageId);
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });
});
mongoose.connection.on('error', () => {
  // webhook('unable to connect database');
  logger.error(`unable to connect to database: ${mongoUri}`);
});

if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    logger.info(
      `Ok, server is running on port ${config.port} (${config.env})`,
    );
  });
}

process.on('unhandledRejection', async (err, promise) => {
  logger.error(err, {
    dispatcher: loggerDispatcher,
    from: 'unhandledRejection event',
    promise,
  });
});

process.on('uncaughtException', (err) => {
  logger.error(
    err,
    { dispatcher: loggerDispatcher, from: 'uncaughtException event' },
    () => {
      process.exit(1);
    },
  );
});
process.on('exit', async (code) => {
  mongoose.connection.close();
  logger.info(`About to exit with code: ${code}`);
});
process.on('SIGINT', function () {
  logger.info('Caught interrupt signal');
  process.exit();
});
