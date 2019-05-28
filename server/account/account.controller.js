"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const Account = require("./account.model");
const smtpTransport = require("../helpers/sendmail")

const sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

const register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      msg: "Please pass username and password."
    });
  } else {
    const account = new Account({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });

    account
      .save()
      .then(result => {
        // console.log(result);
        let token;
        token = Account.generateJwt();
        res.status(201).json({
          message: "Handling POST requests to apis/users",
          createdUser: {
            _id: result._id,
            email: result.email,
            role: result.role,
            token: token
          }
        });
      })
      .catch(err => {
        // console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = (req, res, next) => {
  res.json({ success: true, token: req.user.generateJwt() });
};

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    const user = await findUser(id)
    req = matchedData(req)
    const isPasswordMatch = await auth.checkPassword(req.oldPassword, user)
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch())
    } else {
      // all ok, proceed to change password
      res.status(200).json(await changePasswordInDB(id, req))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

// find account for account verification
const findAccount = async email => {
  return new Promise((resolve, reject) => {
    Account.findOne(
      {
        email
      },
      'password loginAttempts blockExpires name email role verified verification',
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}

const forgetPassword = async (req, res) => {
  try{
    const locale = req.getLocale();
    const data = matchedData(req)
    await findAccount(data.email)
    const item = await saveForgotPassword(req)
    emailer.sendResetPasswordEmailMessage(locale, item)
    res.status(200).json(forgotPasswordResponse(item))
  }catch (error) {
    res.json(error);
  }
  
};

// const logout = (req, res, next) => {
//   User.remove({ _id: req.params.id })
//     .exec()
//     .then(res => {
//       res.status(201).json({
//         success: true,
//         message: "user deleted"
//       })
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       })
//     });

// }


// send confirmation mail to the account hodler

const confirmationMail = (req, res) => {
  let rand = Math.floor((Math.random() * 100) + 54);
  let host = req.get('host');
  let link = "http://" + req.get('host') + "/verify?id=" + rand;

  const mailOptions = {
    to: req.query.to,
    subject: "Please confirm your Email account",
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
}

const verifyAccount = (req, res) => {
  console.log(req.protocol + ":/" + req.get('host'));
  if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
    console.log("Domain is matched. Information is from Authentic email");
    if (req.query.id == rand) {
      console.log("email is verified");
      res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
    } else {
      console.log("email is not verified");
      res.end("<h1>Bad Request</h1>");
    }
  } else {
    res.end("<h1>Request is from unknown source");
  }
}

module.exports = {
  sendJSONresponse,
  register,
  login,
  changePassword,
  forgetPassword,
  confirmationMail,
  verifyAccount
};