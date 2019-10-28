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
const host = `http://192.168.8.103:4040`;

module.exports.sendEmailForResetPassword = async (
  name,
  emailID,
  token,
) => {
  const link = `${host}/api/v1/account/forgetPassword/${token}`;
  const mailOptions = {
    to: emailID,
    subject: 'Generated Token For Reset Password',
    html: `
      <h1> Hi ${name}, </h1>
      <h2> Copy This Link and paste it into POSTMAN </h2>
      <a href="${link}"> Click this link </a>
    `,
  };

  return transporter.sendMail(mailOptions);
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
