const jwt = require('jsonwebtoken');
const redis = require('redis');
const { chatkit } = require('../services/pusher.services');
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
const refreshTokens = {};
const rediscl = redis.createClient('6379', '127.0.0.1');
rediscl.on('connect', () => {
  console.log('redis pluggin');
});

const validateJwt = function(req, res) {
  return new Promise((resolve, reject) => {
    let uid = req.account._id;
    let accesstoken = req.cookies.access_token || null;
    let refreshtoken = req.cookies.refresh_token || null;

    // Check if tokens found in cookies
    if (accesstoken && refreshtoken) {
      // They are, so let's verify the access token
      jwt.verify(accesstoken, config.jwtSecret, async function(
        err,
        decoded,
      ) {
        if (err) {
          // There are three types of errors, but we actually only care
          // about this one, because it says that the access token
          // expired and we need to issue a new one using refresh token
          if (err.name === 'TokenExpiredError') {
            // Let's see if we can find token in Redis. We should, because
            // token expired, which means that we already inserted it into
            // redis at least once.
            let redis_token = rediscl.get(decoded.uid, function(
              err,
              val,
            ) {
              return err ? null : val ? val : null;
            });

            // If the token wasn't found, or the browser has sent us a refresh
            // token that was different than the one in DB last time, then ...
            if (
              !redis_token ||
              redis_token.refresh_token === refreshtoken
            ) {
              // ... we are probably dealing with hack attempt, because either
              // there is no refresh token with that value, or the refresh token
              // from request and storage do not equal for that specific user
              reject('Nice try ;-)');
            } else {
              // It can also happen that the refresh token expires; in that case
              // we need to issue both tokens at the same time
              if (redis_token.expires > new Date()) {
                // refresh token expired, we issue refresh token as well
                let refresh_token = generate_refresh_token(64);

                // Then we assign this token into httpOnly cookie using response
                // object. I disabled the secure option - if you're running on
                // localhost, keep it disabled, otherwise uncomment it if your
                // web app uses HTTPS protocol
                res.cookie('__refresh_token', refresh_token, {
                  // secure: true,
                  httpOnly: true,
                });

                // Then we refresh the expiration for refresh token. 1 month from now
                let refresh_token_maxage =
                  new Date() + jwt_refresh_expiration;

                // And then we save it in Redis
                rediscl.set(
                  decoded.uid,
                  JSON.stringify({
                    refresh_token: refresh_token,
                    expires: refresh_token_maxage,
                  }),
                  rediscl.print,
                );
              }

              // Then we issue access token. Notice that we save user ID
              // inside the JWT payload
              let token = jwt.sign({ uid: decoded.uid }, jwt_secret, {
                expiresIn: jwt_expiration,
              });

              // Again, let's assign this token into httpOnly cookie.
              res.cookie('__access_token', token, {
                // secure: true,
                httpOnly: true,
              });

              // And then return the modified request and response objects,
              // so we can work with them later
              resolve({
                res: res,
                req: req,
              });
            }
          } else {
            // If any error other than "TokenExpiredError" occurs, it means
            // that either token is invalid, or in wrong format, or ...
            reject(err);
          }
        } else {
          // There was no error with validation, access token is valid
          // and none of the tokens expired
          resolve({
            res: res,
            req: req,
          });
        }
      });
    } else {
      // Well, no tokens. Someone is trying to access
      // your web app without being logged in.
      reject('Token missing.');
    }
  });
};

const generateUsername = function(uname) {
  const username =
    uname +
    Math.random()
      .toString(36)
      .slice(2);
  Account.findOne({ username: username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return sendJSONresponse(res, 409, {
          sucess: false,
          message: 'username alraedy exists',
        });
      } else {
        return username;
      }
    })
    .catch(err => {
      return sendJSONresponse(res, 500, {
        sucess: false,
        message: err,
      });
    });
};

const sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

const tokenForUser = function(user) {
  const timestamp = new Date().getTime();
  return jwt.encode(
    {
      _id: user._id,
      iat: timestamp,
      exp: config.jwtExpire,
    },
    config.jwtSecret,
  );
};

// create a new account for individual users
const register = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const contactNo = req.body.contactNo;
  const role = req.body.role;
  const username =
    firstName +
    Math.random()
      .toString(36)
      .slice(2);
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
          message: 'email is already exist',
        });
      } else {
        let account = new Account();
        account.email = email;
        account.firstName = firstName;
        account.lastName = lastName;
        account.username = username;
        account.contactNo = contactNo;
        account.role = role;
        account.password = password;
        token = account.generateJwt();
        account.token = token;
        account
          .save()
          .then(user => {
            req.login(user, async function(err) {
              if (err) {
                return sendJSONresponse(res, 400, {
                  success: false,
                  message: err,
                });
              }
              // user created in chatkit
              await chatkit.createUser({
                id: req.user._id,
                name: req.user.firstName,
              });
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
            let access_token = jwt.sign(info, config.jwtSecret, {
              expiresIn: '1d',
            });
            host = req.get('host');
            link =
              'https://5bd8d95c.ngrok.io/api/v1/account/verifyAccount/' +
              access_token;
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
  let user_id = req.user._id.toString();
  // Generate new refresh token and it's expiration
  let refreshToken = jwt.sign({ uid: user_id }, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  refreshTokens[refreshToken] = user_id;
  // Generate new access token
  let token = req.user.token;
  res.cookie('access_token', token, {
    // secure: true,
    httpOnly: true,
  });
  res.cookie('refresh_token', refreshToken, {
    // secure: true,
    httpOnly: true,
  });
  //client.set('string key', 'string val', redis.print);
  rediscl.set(user_id, refreshToken, rediscl.print);
  const {
    _id,
    email,
    firstName,
    lastName,
    accountVerified,
    role,
    contactNo,
    companies,
    friends,
    pendingFriends,
    sendingFriendList,
  } = req.user;
  let user = {
    _id,
    email,
    firstName,
    lastName,
    accountVerified,
    role,
    contactNo,
    companies,
    friends,
    pendingFriends,
    sendingFriendList,
  };
  res.json({
    success: true,
    user,
    token,
    refreshToken,
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
  let uid = req.user._id;
  // Delete user refresh token from Redis
  rediscl.del(uid);
  // ... and then remove httpOnly cookies from browser
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  req.logout();
  res.json({
    success: true,
    msg: 'You are successfully logout',
  });
  res.end();
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
      let info = {};
      info.user = user._id;
      info.expires = new Date(
        // expire within 1 month
        new Date().getTime() + 2630000,
      );
      let token = jwt.encode(info, config.jwtSecret);
      host = req.get('host');
      link =
        'https://5bd8d95c.ngrok.io/api/v1/account/changePassword/' +
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

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const verifyChangePassword = async (req, res) => {
  let token = req.params.token;
  let data = jwt.decode(token, config.jwtSecret);
  if (new Date(data.expires) > new Date()) {
    await Account.findOne({ _id: data.user._id })
      .exec()
      .then(user => {
        return sendJSONresponse(res, 200, {
          success: true,
          message: 'you have permission to change the password',
          user,
        });
      })
      .catch(err => {
        return sendJSONresponse(res, 400, {
          success: false,
          message: 'account not found',
        });
      });
  } else {
    return sendJSONresponse(res, 400, {
      success: false,
      message: 'token time expired',
    });
  }
};
// TODOS: need to test in postman tomorrow
const changePassword = async (req, res) => {
  let newPassword = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  const userID = req.user.id;
  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Password Not Matching' });
  let user = await Account.findOne({ _id: userID })
    .exec()
    .then(user => {
      user.password = newPassword;
      user.save();
      return res.status(200).json({
        message: 'Password Changed',
        user,
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: 'server error',
      });
    });
  user.password = newPassword;
  await user.save();
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
  let fromFriend = req.user.id;
  let toFriend = req.query.userID;

  // you can not add yourself
  if (fromFriend === toFriend) {
    return sendJSONresponse(res, 400, {
      success: false,
      message: 'You can not add yourself',
    });
  }
  Account.findById(fromFriend).then(account => {
    if (
      account.sendingFriendList.filter(
        friend => friend.toString() === toFriend,
      ).length > 0
    ) {
      return sendJSONresponse(res, 200, {
        success: true,
        message: `you already send request to this ${toFriend}`,
      });
    } else {
      account.sendingFriendList.push(toFriend);
      account.save();
      // sending friend request to toFriend
      Account.findById(toFriend).then(account => {
        if (
          account.pendingFriends.filter(
            friend => friend.toString() === fromFriend,
          ).length > 0
        ) {
          return res.status(400).json({
            success: false,
            msg: 'this id is already in your pending list',
          });
        }
        account.pendingFriends.push(fromFriend);
        account.save();
        return sendJSONresponse(res, 200, {
          success: true,
          message: `Friend request send to ${toFriend}`,
        });

        //
      });
    }
  });
};

// check in pending request the id exist or not
const pendingFriendRequestList = async (req, res) => {
  let reqUserID = req.account.id;
  Account.findById(reqUserID).then(account => {
    let pendingList = account.pendingFriends;
    let listPendingReq = [];
    pendingList.forEach((value, key) => {
      listPendingReq.push(value);
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
  let acceptedID = req.query.userID;

  // accept friend request
  Account.findById(reqUserID).then(account => {
    account.friends.push(acceptedID);
    account.pendingFriends.remove(acceptedID);
    account.save();

    //
    Account.findById(acceptedID).then(account => {
      account.friends.push(reqUserID);
      account.sendingFriendList.remove(reqUserID);
      account.save();
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'you both connect with each other',
      });
    });
  });
};

// friend List information
const friendList = async (req, res) => {
  Account.findById(req.user._id)
    .populate(
      'friends',
      '_id email firstName lastName accountVerified role contactNo companies friends pendingFriends sendingFriendList',
    )
    .exec()
    .then(account => {
      if (!account) {
        return sendJSONresponse(res, 500, {
          success: false,
          message: 'No account found',
        });
      }
      const { friends } = account;
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'List of friends',
        friends,
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

// sending Friend request List
const sendFriendRequestList = async (req, res) => {
  let reqUserID = req.account.id;
  Account.findById(reqUserID).then(account => {
    let sendFriendRequestList = account.sendingFriendList;
    let listPendingReq = [];
    pendingList.forEach((value, key) => {
      listPendingReq.push(value);
    });
    return res.status(200).json({
      success: true,
      msg: 'pending friend request list',
      list: listPendingReq,
    });
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
  const {
    _id,
    email,
    firstName,
    lastName,
    accountVerified,
    role,
    contactNo,
    companies,
    friends,
    pendingFriends,
    sendingFriendList,
  } = req.user;
  let user = {
    _id,
    email,
    firstName,
    lastName,
    accountVerified,
    role,
    contactNo,
    companies,
    friends,
    pendingFriends,
    sendingFriendList,
  };
  res.json({
    success: true,
    user,
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

// verify token
const tokenVerification = async (req, res) => {
  const email = req.body.email;
  const refreshToken = req.body.refreshToken;
  console.log(email, refreshToken);
  if (
    refreshToken in refreshTokens &&
    refreshTokens[refreshToken] == email
  ) {
    const user = {
      email: email,
    };
    const token = jwt.sign(user, config.jwtSecret, {
      expiresIn: '1d',
    });
    res.json({ token: token });
  } else {
    res.json(401);
  }
};
module.exports = {
  sendJSONresponse,
  register,
  login,
  logout,
  verifyChangePassword,
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
  friendList,
  // removeFollowing,
  // removeFollower,
  acceptFriendRequest,
  sendFriendRequestList,
  // rejectFriendRequest,
  // removeFriend
  tokenVerification,
  validateJwt,
};
