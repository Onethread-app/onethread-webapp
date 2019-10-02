const nodemailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/winston');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailAddress,
    pass: config.emailPassword,
  },
});

const { port } = config;
const host = `http://localhost:4000` || `http://13.235.75.2:4040`;

module.exports.sendEmailForResetPassword = async (
  username,
  emailID,
  token,
) => {
  const link = `${host}/api/v1/account/verifyAccount/` + token;
  const mailOptions = {
    to: emailID,
    subject: 'Please confirm your Email account',
    html:
      `Hello ${emailID}, <br> Please Click on the link to verify your email.<br><a href=` +
      link +
      '>Click here to verify</a>',
  };

  return transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      logger.error(' Message send to failed ' + err);
    } else {
      logger.info('Message send to user successfully');
    }
  });
};

module.exports.sendEmailForVerifyAccount = async (
  username,
  emailID,
  token,
) => {
  const link = `${host}/api/v1/account/verifyAccount/` + token;
  const mailOptions = {
    to: emailID,
    subject: 'Please confirm your Email account',
    html:
      `Hello ${emailID}, <br> Please Click on the link to verify your email.<br><a href=` +
      link +
      '>Click here to verify</a>',
  };

  return transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      logger.error(' Message send to failed ' + err);
    } else {
      logger.info('Message send to user successfully');
    }
  });
};
