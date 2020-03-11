const nodemailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/winston');
const { capitalizeName } = require('../helpers/capitalizeLetter');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailAddress,
    pass: config.emailPassword,
  },
});

const { port } = config;
let host = ``;
if (config.env === 'production') {
  host = `https://www.tigrow.co`;
} else if (config.env === 'test') {
  host = `http://test.tigrow.co.s3-website-ap-southeast-1.amazonaws.com`;
} else if (config.env === 'test4') {
  host = `http://test.tigrow.co.s3-website-ap-southeast-1.amazonaws.com`;
}else{
  host = `http//localhost:3000`;
}

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
  let name = firstName + ' ' + lastName;
  const fullName = capitalizeName(name);
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

module.exports.sendInviteColleague = async (
  userEmail,
  company,
  emailList,
) => {
  const link = `${host}/signup`;

  const mailOptions = {
    to: emailList,
    subject: 'Invitation to join company',
    html: `
      <h1> Join ${company.name} on TiGrow, </h1>
      <h2> ${userEmail} has invited you to join the company ${company.name}. join now to start collaborating!  <a href="${link}"> Link </a> </h2>
  
    `,
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return next(err);
    }
    logger.info(`send company invitation mail to users successfully`);
    return info;
  });
};
