"use strict";

const Account = require("./account.model");
const smtpTransport = require("../helpers/sendmail");

const sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

const register = async(req, res) => {
    const account = new Account({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    account
      .save()
      .then(result => {
        let token;
        token = account.generateJwt();
        res.status(200).json({
          success: true,
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

// let's logout
const logout = (req, res) => {
  req.logout();
  res.json({
    success: true,
    msg:'You are successfully logout'
  });
  res.end();
}

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id);
    const user = await findUser(id);
    req = matchedData(req);
    const isPasswordMatch = await auth.checkPassword(req.oldPassword, user);
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch());
    } else {
      // all ok, proceed to change password
      res.status(200).json(await changePasswordInDB(id, req));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

// find account for account verification
const findAccount = async email => {
  return new Promise((resolve, reject) => {
    Account.findOne(
      {
        email
      },
      "password loginAttempts blockExpires name email role verified verification",
      (err, item) => {
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    );
  });
};

const forgetPassword = async (req, res) => {
  try {
    const locale = req.getLocale();
    const data = matchedData(req);
    await findAccount(data.email);
    const item = await saveForgotPassword(req);
    emailer.sendResetPasswordEmailMessage(locale, item);
    res.status(200).json(forgotPasswordResponse(item));
  } catch (error) {
    res.json(error);
  }
};

// send confirmation mail to the account hodler

const confirmationMail = (req, res) => {
  let rand = Math.floor(Math.random() * 100 + 54);
  let host = req.get("host");
  let link = "http://" + req.get("host") + "/verify?id=" + rand;

  const mailOptions = {
    to: req.query.to,
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
};

const verifyAccount = (req, res) => {
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + host) {
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
};

module.exports = {
  sendJSONresponse,
  register,
  login,
  logout,
  changePassword,
  forgetPassword,
  confirmationMail,
  verifyAccount
};
