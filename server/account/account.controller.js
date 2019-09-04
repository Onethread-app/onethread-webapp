const jwt = require('jwt-simple');
const Account = require('./account.model');
const smtpTransport = require('../helpers/sendmail');
const authService = require('../services/auth.services');
const bcryptService = require('../services/bcrypt.services');
const config = require('../../config/config');

// Declaring all variables
let token = '';
let rand = '';
let link = '';
let host = '';

const sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

const tokenForUser = function(user) {
  const timestamp = new Date().getTime();
  return jwt.encode(
    {
      id: user.id,
      iat: timestamp,
    },
    config.jwtSecret,
  );
};

// TODO: need to solve tomorrow

// create a new account for individual users
const register = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const contactNo = req.body.contactNo;
  const role = req.body.role;

  if (!email || !password) {
    return sendJSONresponse(res, 422, {
      error: 'You must provide email and password.',
    });
  }

  Account.find({
    email: email,
  })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'email is already exits',
        });
      } else {
        let account = new Account();
        account.email = email;
        account.firstName = firstName;
        account.lastName = lastName;
        account.contactNo = contactNo;
        account.role = role;
        account.password = password;
        token = account.generateJwt();
        account.token = token;
        account
          .save()
          .then(user => {
            req.login(user, function(err) {
              if (err) {
                return sendJSONresponse(res, 400, {
                  success: false,
                  message: err,
                });
              }
              return sendJSONresponse(res, 201, {
                success: true,
                token: token,
                message: 'User created',
                user,
              });
            });
          })
          .then(() => {
            const info = {};
            info.account = account;
            info.expires = new Date(
              // expire within 1 month
              new Date().getTime() + 2630000,
            );
            let token = jwt.encode(info, config.jwtSecret);
            host = req.get('host');
            link =
              'https://5bd8d95c.ngrok.io/api/v1/account/verifyAccount/' +
              token;
            let mailOptions = {
              to: email,
              subject: 'Please confirm your Email account',
              html:
                'Hello,<br> Please Click on the link to verify your email.<br><a href=' +
                link +
                '>Click here to verify</a>',
            };
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(err, res) {
              if (err) {
                console.log(err);
              } else {
                console.log('Message sent: ' + res);
                res.end({
                  success: true,
                  msg: 'sent',
                });
              }
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {* token}
 */

// account holder can login their account
const login = async (req, res) => {
  let accountInfo = {};
  accountInfo.userId = req.user._id;
  accountInfo.firstName = req.user.firstName;
  accountInfo.lastName = req.user.lastName;
  accountInfo.accountVerified = req.user.accountVerified;
  accountInfo.role = req.user.role;
  accountInfo.contactNo = req.user.contactNo;
  accountInfo.companies = req.user.companies;
  res.json({
    success: true,
    token: tokenForUser(req.user),
    user: req.user,
  });
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {* token}
 */

// account holder can update their account information
const accountUpdate = async (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const contactNo = req.body.contactNo;

  Account.findById(req.account._id)
    .then(account => {
      Account.find({
        email: email,
      })
        .exec()
        .then(user => {
          if (user.length >= 1) {
            return res.status(409).json({
              message: 'email is already exits',
            });
          } else {
            let account = new Account();
            account.email = email;
            account.firstName = firstName;
            account.lastName = lastName;
            account.contactNo = contactNo;
            account.password = req.account.password;
            account.save().then(() => {
              return sendJSONresponse(res, 201, {
                success: true,
                message: 'Account Information updated',
              });
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

// let's logout
const logout = async (req, res) => {
  req.logout();
  res.json({
    success: true,
    msg: 'You are successfully logout',
  });
  res.end();
};

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async () => {};

// find account for account verification
const findAccount = async email => {
  // return new Promise((resolve, reject) => {
  //   Account.findOne({
  //       email
  //     },
  //     "password loginAttempts blockExpires name email role verified verification",
  //     (err, item) => {
  //       utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
  //       resolve(item);
  //     }
  //   );
  // });
};

const forgetPassword = async (req, res) => {
  // try {
  //   const locale = req.getLocale();
  //   const data = matchedData(req);
  //   await findAccount(data.email);
  //   const item = await saveForgotPassword(req);
  //   emailer.sendResetPasswordEmailMessage(locale, item);
  //   res.status(200).json(forgotPasswordResponse(item));
  // } catch (error) {
  //   res.json(error);
  // }
  const email = req.body.email;
  Account.findOne({
    email: email,
  })
    .exec()
    .then(user => {
      let token = jwt.encode(info, config.jwtSecret);
      host = req.get('host');
      link =
        'https://5bd8d95c.ngrok.io/api/v1/account/verifyAccount/' +
        token;
      let mailOptions = {
        to: user.email,
        subject: 'Reset your password',
        html:
          'Hello,<br> Please Click on the link to reset your password.<br><a href=' +
          link +
          '>Click here to verify</a>',
      };
      smtpTransport.sendMail(mailOptions, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log('Message sent: ' + res);
          res.end({
            success: true,
            msg: 'sent',
          });
        }
      });
    })

    .catch(err => {
      return res.status(400).json({
        success: false,
        message: 'Email id does not exist',
      });
    });
};

// verifying mail address
const verifyAccount = async (req, res) => {
  let token = req.params.token;
  let data = jwt.decode(token, config.jwtSecret);
  if (new Date(data.expires) > new Date()) {
    Account.findOne({
      _id: data.account._id,
      email: data.account.email,
    }).exec(function(err, account) {
      if (err) {
        console.log(err);
        res.json(err);
      } else if (!account) {
        console.log('Account not found');
        res.json({ error: 'Account not found' });
      } else {
        console.log('Account found');
        account.accountVerified = true;
        account.save(function(update_err, update_data) {
          if (update_err) {
            res.json({ success: false, error: update_err });
          } else {
            res.status(200).json({
              sucess: true,
              message: 'Account is verified',
            });
          }
        });
      }
    });
  } else {
    Account.deleteOne({ _id: data.account._id })
      .then(account => {
        account.save();
      })
      .catch(err => {
        return res
          .status(200)
          .json({ sucess: false, error: 'Link is expired' });
      });
  }
};

// const followAccount = (req, res) => {
// 	let reqUserID = req.user.id;
// 	let reqQueryID = req.query.id;
// 	// check if you follow yourself
// 	if (reqUserID === reqQueryID) {
// 		return res.status(400).json({
// 			success: false,
// 			msg: "You cannot follow yourself"
// 		});
// 	}
// 	Account.findById(reqQueryID)
// 		.then(account => {
// 			//console.log(account);
// 			// check if the requested user is already in follower list
// 			if (account.followers.filter(follower =>
// 					follower.user.toString() === reqUserID).length > 0) {
// 				return res.status(400).json({
// 					success: false,
// 					msg: "You already followed the user"
// 				});
// 			}
// 			account.followers.unshift({
// 				user: reqUserID
// 			});
// 			account.save();
// 			Account.findOne({
// 					email: req.user.email
// 				})
// 				.then(account => {
// 					account.following.unshift({
// 						user: reqQueryID
// 					});
// 					account.save().then(user => res.json(user));
// 				})
// 				.catch(err => res.status(404).json({
// 					success: false,
// 					msg: "you already follow the user"
// 				}));
// 		});
// };

// const removeFollowing = (req, res, next) => {
// 	let reqUserID = req.user.id;
// 	let unfollowId = req.query.id;
// 	console.log(reqUserID, unfollowId);
// 	Account.findByIdAndUpdate(reqUserID, {
// 		$pull: {
// 			"followers": {
// 				"user": reqUserID
// 			}
// 		}
// 	}, (err, result) => {
// 		if (err) {
// 			return res.status(400).json({
// 				error: (err)
// 			});
// 		}
// 		next();
// 	});
// };

// const removeFollower = (req, res) => {
// 	let reqUserID = req.user.id;
// 	let unfollowId = req.query.id;
// 	console.log(reqUserID, unfollowId);
// 	Account.findByIdAndUpdate(unfollowId, {
// 			$pull: {
// 				"followers": {
// 					"user": reqUserID
// 				}
// 			}
// 		}, {
// 			new: true
// 		})
// 		.populate('following', '_id')
// 		.populate('followers', '_id')
// 		.exec((err, result) => {
// 			if (err) {
// 				return res.status(400).json({
// 					error: (err)
// 				});
// 			}
// 			res.status(200).json({
// 				success: true,
// 				msg: "unfollow successfully done",
// 				result: result
// 			});
// 		});
// };

// send friend request to an account
const sendFriendRequest = async (req, res) => {
  console.log(req.user);
  let fromFriend = req.user.id;
  let toFriend = req.query.userID;
  Account.findById(toFriend).then(account => {
    if (
      account.pendingFriends.filter(
        friend => friend.user.toString() === fromFriend,
      ).length > 0
    ) {
      return res.status(400).json({
        success: false,
        msg: 'this id is already in your pending list',
      });
    }
    account.pendingFriends.unshift({
      user: fromFriend,
      status: 'pending',
    });
    account.save();
    Account.findOne({
      email: req.user.email,
    })
      .then(account => {
        account.friends.unshift({
          user: toFriend,
        });
        account.save().then(user =>
          res.json({
            sucess: true,
            msg: 'request is sent to the user',
            friendinfo: user,
          }),
        );
      })
      .catch(err =>
        res.status(404).json({
          success: false,
          msg: 'you already in his pendinglist',
          error: err,
        }),
      );
  });
};

// check in pending request the id exist or not
const pendingFriendRequestList = async (req, res) => {
  let reqUserID = req.account.id;
  Account.findById(reqUserID).then(account => {
    let pendingList = account.pendingFriends;
    let listPendingReq = [];
    pendingList.forEach((value, key) => {
      listPendingReq.push(value.user);
    });
    return res.status(200).json({
      success: true,
      msg: 'pending friend request list',
      list: listPendingReq,
    });
  });
};

// Accept Friend request
const acceptFriendRequest = async (req, res) => {
  let reqUserID = req.user.id;
  let reqQueryID = req.query.userID;
  console.log(reqUserID, reqQueryID);

  Account.findById(reqUserID).then(account => {
    account.friends.unshift({
      user: reqQueryID,
    });
    account.save();
    Account.findByIdAndUpdate(
      reqUserID,
      {
        $pull: {
          pendingFriends: {
            user: reqQueryID,
          },
        },
      },
      (err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.status(200).json({
          success: true,
          msg: 'you both conenct with each other',
        });
      },
    );
  });
  Account.findById(reqQueryID).then(account => {
    account.friends.unshift({
      user: reqQueryID,
    });
    account.save();
  });
};

// reject friend request
// const rejectFriendRequest = async (req, res) => {
// 	let reqUserID = req.user.id;
// 	let reqQueryID = req.query.userID;
// 	console.log(reqUserID, reqQueryID);

// 	Account.findById(reqUserID)
// 		.then(account => {
// 			Account.findByIdAndUpdate(reqUserID, {
// 					$pull: {
// 						"pendingFriends": {
// 							"user": reqQueryID
// 						}
// 					}
// 				}, (err, result) => {
// 					if (err) {
// 						return res.status(400).json({
// 							error: err
// 						});
// 					}
// 					res.status(200).json({
// 						success: true,
// 						msg: "successfully reject the user",
// 						result: result
// 					});
// 				}

// 			);
// 		});
// };

// remove friend from friend list
// const removeFriend = async (req, res) => {
// 	let reqUserID = req.user.id;
// 	let reqQueryID = req.query.userID;
// 	Account.findByIdAndUpdate(reqUserID, {
// 		$pull: {
// 			"friends": {
// 				"user": reqQueryID
// 			}
// 		}
// 	}, (err, result) => {
// 		if (err) {
// 			return res.status(400).json({
// 				error: err
// 			});
// 		}
// 		Account.findByIdAndUpdate(reqQueryID, {
// 			$pull: {
// 				"friends": {
// 					"user": reqUserID
// 				}
// 			}
// 		}, (err, result) => {
// 			if (err) {
// 				return res.status(400).json({
// 					error: err
// 				});
// 			}
// 			res.status(200).json({
// 				success: true,
// 				msg: "unfriend successful",
// 				result: result
// 			});
// 		});
// 	});

// };

const getAllAccounts = async (req, res) => {
  console.log(req.user);
};

const getAccount = async (req, res) => {
  let accountInfo = req.account;
  return sendJSONresponse(res, 200, {
    sucess: true,
    msg: accountInfo,
  });
};

const accountLoad = async (req, res, next, id) => {
  Account.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.account = result;
        next();
      } else {
        return res.status(400).json({
          message: 'No valid entry found for provided ID',
        });
      }
    })
    .catch(err => {
      return next(err);
    });
};

const searchAccount = async (req, res) => {};
module.exports = {
  sendJSONresponse,
  register,
  login,
  logout,
  changePassword,
  forgetPassword,
  verifyAccount,
  // followAccount,
  pendingFriendRequestList,
  searchAccount,
  getAllAccounts,
  getAccount,
  accountLoad,
  accountUpdate,
  sendFriendRequest,
  // removeFollowing,
  // removeFollower,
  acceptFriendRequest,
  // rejectFriendRequest,
  // removeFriend
};
