const cron = require('node-cron');
const express = require('express');
const config = require('./config/config');
const nodeMailer = require('nodemailer');
const {
  Subscription,
} = require('./server/subscription/subscription.model');

app = express();
console.log('I am starting.....');
let startDate = new Date();
console.log(startDate);
const companyId = Subscription.find({
  expireAt: { $gte: new Date() },
});
// schedule tasks to be run on the server
cron.schedule('* * * * *', function () {
  console.log('Running Cron Job');
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.emailAddress,
      pass: config.emailPassword,
    },
  });

  const mailOptions = {
    from: config.emailAddress, // sender address
    to: config.emailAddress, // list of receivers
    subject: 'Hello there!', // Subject line
    text: 'A Message from Node Cron App', // plain text body
    html: '<b>A Message from Node Cron App</b>', // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    console.log(info.messageId);
    if (err) {
      console.log(err);
    }
  });
});

app.listen(8000);
