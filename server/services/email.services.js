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
let host = ``;
if (config.env !== 'production') {
  host = `http://localhost:3000`;
}
if (config.env === 'test') {
  host = `http://test.tigrow.co.s3-website-ap-southeast-1.amazonaws.com`;
}
module.exports.sendEmailForResetPassword = async (
  firstName,
  lastName,
  emailID,
  token,
) => {
  const link = `${host}/reset-password/${token}`;
  const fullName = firstName + ' ' + lastName;
  const mailOptions = {
    to: emailID,
    subject: 'Generated Token For Reset Password',
    html: `
      <h1> Hi ${fullName}, </h1>
      <h2> Please Reset Your password from following <a href="${link}"> Link </a> </h2>
  
    `,
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return next(err);
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
  const link = `${host}/verify-account/` + token;
  const fullName = firstName + ' ' + lastName;
  const mailOptions = {
    to: emailID,
    subject: 'Please confirm your Email account',
    html:
      `Hello ${fullName}, <br> Please Click on the link to verify your email.<br><a href=` +
      link +
      '>Click here to verify</a>',
  };

  return transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      logger.error(' Message send to failed ' + err);
    } else {
      logger.info(`send confirmation mail to user successfully`);
    }
  });
};
