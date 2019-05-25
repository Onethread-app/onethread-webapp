"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError");

const config = require("../../../config/config");
const User = require("../model/account.model");
const auth = require("../auth");
const smtpTransport = require("../services/sendmail")

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
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role

    });

    user
      .save()
      .then(result => {
        // console.log(result);
        let token;
        token = user.generateJwt();
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

const roleAuthorization = (roles) => {

  return function (req, res, next) {
    console.log(user._id);

    User.findById(user._id, function (err, foundUser) {
      let role = foundUser.role;
      console.log(role);
      if (err) {
        res.status(422).json({
          error: 'No user found.'
        });
        return next(err);
      }

      if (roles.indexOf(foundUser.role) > -1) {
        return next();
      }

      res.status(401).json({
        error: 'You are not authorized to view this content'
      });
      return next('Unauthorized');

    });

  }

}
/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = (req, res, next) => {
  User.findOne({
      username: req.body.email
    },
    function (err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: "Authentication failed. User not found."
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token

            let token = user.generateJwt();
            // return the information including token as JSON
            res.json({
              success: true,
              token: token
            });
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password."
            });
          }
        });
      }
    }
  );
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

const forgetPassword = async (req, res) => {
  async.waterfall([
    function (done) {
      User.findOne({
        email: req.body.email
      }).exec(function (err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function (user, done) {
      // create the random token
      let token = user.generateJwt();
      done(err, user, token);

    },
    function (user, token, done) {
      User.findByIdAndUpdate({
        _id: user._id
      }, {
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000
      }, {
        upsert: true,
        new: true
      }).exec(function (err, new_user) {
        done(err, token, new_user);
      });
    },
    function (token, user, done) {
      var data = {
        to: user.email,
        from: email,
        template: 'forgot-password-email',
        subject: 'Password help has arrived!',
        context: {
          url: 'http://localhost:3000/auth/reset_password?token=' + token,
          name: user.fullName.split(' ')[0]
        }
      };

      smtpTransport.sendMail(data, function (err) {
        if (!err) {
          return res.json({
            message: 'Kindly check your email for further instructions'
          });
        } else {
          return done(err);
        }
      });
    }
  ], function (err) {
    return res.status(422).json({
      message: err
    });
  });
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

const profileList = (req, res, next) => {
  const {
    limit = 50, skip = 0
  } = req.query;
  User.find()
    .sort({
      createdAt: -1
    })
    .skip(+skip)
    .limit(+limit)
    .exec(function (err, user) {
      if (err) {
        return res.status(422).send({
          message: err
        });
      } else {
        res.json(user);
      }
    });
}
const profile = (req, res, next) => {
  const currentUser = req.user;
  const id = (req.params.id);
  console.log(id);
  User.findById(id, function (err, user) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    } else {
      res.json(user);
    }

  });
}

const profileUpdate = (req, res) => {
  const currentUser = req.user;
  User.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, function (err, user) {
    if (err) {
      return res.status().send({
        message: err
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "Profile update successful",
        user: user
      });
    }
  });
}

const profileDelete = (req, res) => {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return res.status().send({
        message: err
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "Profile Delete successful"
      });
    }
  })

}

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

const verifyAccount = (req, res)=> {
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
  profileList,
  profile,
  profileUpdate,
  profileDelete,
  roleAuthorization,
  changePassword,
  forgetPassword,
  confirmationMail,
  verifyAccount
};