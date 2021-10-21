const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const hbs = require('nodemailer-express-handlebars');

const config = require('../../config/config');
const logger = require('../../config/winston');
const { capitalizeName } = require('../helpers/capitalizeLetter');
const { todaysDate } = require('../helpers/DateFormat');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.emailAddress,
    pass: config.emailPassword,
  },
  from: config.emailAddress,
});

let host = ``;
if (config.env === 'production') {
  host = `https://www.onethread.app`;
} else if (config.env === 'test') {
  host = `https://stage.tigrow.co`;
} else if (config.env === 'test3') {
  host = `http://test3.tigrow.co.s3-website-ap-southeast-1.amazonaws.com`;
} else if (config.env === 'test4') {
  host = `http://test4.tigrow.co.s3-website-ap-southeast-1.amazonaws.com`;
} else if (config.env === 'local') {
  host = `http://localhost:3000`;
} else {
  host = `http://localhost:3000`;
}
const options = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: 'templates',
    layoutsDir: 'templates',
    defaultLayout: false,
  },
  viewPath: 'templates',
};
transporter.use('compile', hbs(options));
module.exports.sendEmailForResetPassword = async (
  firstName,
  lastName,
  emailID,
  token,
) => {
  const link = `${host}/reset-password/${token}`;
  let name = firstName + ' ' + lastName;
  const fullName = capitalizeName(name);
  const mailOptions = {
    from: config.emailAddress,
    to: emailID,
    subject: 'Generated Token For Reset Password',
    template: 'resetPassword-confirmation',
    context: {
      name: fullName,
      link: link,
    },
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.error(' Message send to failed ' + err);
    }
    logger.info(`send reset password mail to user successfully`);
    return info;
  });
};

module.exports.sendEmailForVerifyAccount = async (
  firstName,
  lastName,
  emailID,
  token,
) => {
  const link = `${host}/verify-account/${token}`;
  let name = firstName + ' ' + lastName;
  const fullName = capitalizeName(name);
  const mailOptions = {
    from: config.emailAddress,
    to: emailID,
    subject: 'Please confirm your Email account',
    template: 'signup-confirmation',
    context: {
      name: fullName,
      link: link,
    },
  };

  return transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      logger.error(' Message send to failed ' + err);
    } else {
      logger.info(`send confirmation mail to user successfully`);
    }
  });
};

module.exports.signupMail = async (email, token) => {
  const link = `${host}/user-info?email=${email}&token=${token}`;
  const mailOptions = {
    from: config.emailAddress,
    to: email,
    subject: 'Invitation To Join Onethread',
    template: 'invitation-signup',
    context: {
      link: link,
    },
  };

  return transporter.sendMail(mailOptions);
};

module.exports.sendInviteColleague = async (
  userEmail,
  company,
  emailList,
) => {
  const link = `${host}/signup`;

  const mailOptions = {
    from: config.emailAddress,
    to: emailList,
    subject: 'Invitation to join company',
    html: `
      <h1> Join ${company.name} on Onethread, </h1>
      <h2> ${userEmail} has invited you to join the company ${company.name}. join now to start collaborating!  <a href="${link}"> Link </a> </h2>
  
    `,
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.error(' Message send to failed ' + err);
    }
    logger.info(`send company invitation mail to users successfully`);
    return info;
  });
};

module.exports.sendMailAsTaskReminder = async (
  todaysTaskNames,
  todaysSubtaskNames,
  usernameEmailMapper,
) => {
  const usernames = Object.keys(usernameEmailMapper);

  await Promise.all(
    usernames.map(async (username) => {
      const link = `${host}/${username}/home`;
      const getMarkup = (task) => {
        if (!task) return 'No task available';
        return task
          .map(
            (t) =>
              `<li>${t.name} (${host}/company/${t.company}/project/${t.project}/board/${t.boardId}/task/${t._id})</li>`,
          )
          .join(',');
      };
      if (
        !todaysTaskNames[username] &&
        !todaysSubtaskNames[username]
      ) {
        return false;
      }
      const taskListMarkup = getMarkup(todaysTaskNames[username]);
      const subTaskListMarkup = getMarkup(
        todaysSubtaskNames[username],
      );

      const mailOptions = {
        from: config.emailAddress,
        to: usernameEmailMapper[username],
        subject: `[Onethread] Task Reminder - ${todaysDate('.')}`,
        html: `
      <h2> Todays Task </h2>
      ${taskListMarkup}
      <h2> Todays Subtask </h2>
      ${subTaskListMarkup} <br> <br>

      <h3>For more details: ${link}</h3>
    `,
      };

      return transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          logger.error(' Message send to failed ' + err);
        }
        logger.info(
          `send company invitation mail to users successfully`,
        );
        return info;
      });
    }),
  );
};

module.exports.contactSaleMail = async (email, subject, message) => {
  const sesConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: config.awsSesAccessKey,
    secretAccessKey: config.awsSesSecretKey,
    region: config.sesRegion,
  };
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        'contact@onethread.app',
        'orvi@onethread.app',
        /* more items */
      ],
      ToAddresses: [
        'contact@onethread.app',
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Text: {
          Charset: 'UTF-8',
          Data: `${message}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${subject}`,
      },
    },
    Source: email /* required */,
    ReplyToAddresses: [
      email,
      /* more items */
    ],
  };

  // Create the promise and SES service object
  const sendPromise = new AWS.SES(sesConfig)
    .sendEmail(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then((data) => {
      logger.info(data.MessageId);
    })
    .catch((err) => {
      logger.error(err, err.stack);
    });
};
