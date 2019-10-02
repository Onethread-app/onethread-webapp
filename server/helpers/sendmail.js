const nodemailer = require('nodemailer');
const config = require('../../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailAddress,
    pass: config.emailPassword,
  },
});

const { port } = config;
const host = `http://localhost:${port}`;

module.exports.sendEmailForResetPassword = async (
  username,
  emailID,
  token,
) => {
  const link = `${host}/auth/forgetPassword/${token}`;
  const mailOptions = {
    from: config.emailID,
    to: emailID,
    subject: 'Generated Token For Reset Password',
    html: `
      <h1> Hi ${username}, </h1>
      <h2> Copy This Link and paste it into POSTMAN </h2>
      <a href="${link}"> ${link} </a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports.sendEmailForVerifyAccount = async (
  username,
  emailID,
  token,
) => {
  const link = `${host}/auth/verifyAccount/${token}`;
  const mailOptions = {
    from: config.emailID,
    to: emailID,
    subject: 'Generated Token For Account Verification',
    html: `
      <h1> Hi ${username}, </h1>
      <h2> Copy This Link and paste it into POSTMAN </h2>
      <a href="${link}"> ${link} </a>
    `,
  };

  return transporter.sendMail(mailOptions);
};
