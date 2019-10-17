const jwt = require('jsonwebtoken');
const redis = require('redis');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const redisClient = '../../index.redis.js';
const Account = require('./account.model');
const {
  sendEmailForVerifyAccount,
  sendEmailForResetPassword,
} = require('../services/email.services');
const authService = require('../services/auth.services');
const bcryptService = require('../services/bcrypt.services');
const { chatkit } = require('../services/pusher.services');
const config = require('../../config/config');
const isEmailExist = require('../services/emailchecker.services');
const { sendJSONresponse } = require('../helpers/jsonResponse');

const {
  APIError,
  EmailIdExistError,
  BadRequestError,
  SearchNotMatchError,
} = require('../helpers/APIError');

const logger = require('../../config/winston');
// Declaring all variables
let token = '';

const client = redis.createClient(
  config.redis.port,
  config.redis.host,
);

// create a new account for individual users
const register = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const contactNo = req.body.contactNo;
  const role = req.body.role;
  const uniqueHash = bcrypt.hashSync(email, 1);
  const name = firstName + uniqueHash;
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
        const error = new EmailIdExistError(
          'Email id exist',
          httpStatus.CONFLICT,
        );
        return next(error);
      } else {
        let account = new Account();
        account.email = email;
        account.firstName = firstName;
        account.lastName = lastName;
        account.name = name;
        account.contactNo = contactNo;
        account.role = role;
        account.password = password;
        token = account.generateJwt();
        account.token = token;
        account.save().then(async user => {
          const info = {};
          info.account = account;
          info.expires = new Date(
            // expire within 1 month
            new Date().getTime() + 2630000,
          );
          let access_token = jwt.sign(info, config.jwtSecret, {
            expiresIn: '1d',
          });
          const emailResponse = await sendEmailForVerifyAccount(
            account.name,
            account.email,
            access_token,
          );
          req.login(user, async function(err) {
            if (err) {
              return sendJSONresponse(res, 400, {
                success: false,
                message: err,
              });
            } else {
              // user created in chatkit
              await chatkit.createUser({
                id: req.user._id,
                name: req.user.name,
              });
              return sendJSONresponse(res, 201, {
                success: true,
                token: token,
                message: 'User created',
                user,
                emailResponse,
              });
            }
          });
        });
      }
    })
    .catch(err => {
      logger.error(`Registration Error: ${err}`);
      const error = new BadRequestError(
        'Bad Request Error',
        httpStatus.BAD_REQUEST,
      );
      return next(error);
    });
};

/**
 * Returns jwt token if valid uname and password is provided
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
  //refreshTokens[refreshToken] = user_id;
  // Generate new access token
  let token = req.user.token;
  //client.set('string key', 'string val', redis.print);
  client.set(user_id, refreshToken);
  res.json({
    success: true,
    user: req.user,
    token,
    refreshToken,
  });
};

/**
 * Returns jwt token if valid uname and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {* token}
 */

// account holder can update their account information
const accountUpdate = async (req, res, next) => {
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }
  Account.findByIdAndUpdate({ _id: req.user.id }, req.body)
    .exec()
    .then(async user => {
      if (user) {
        if (req.body.name !== user.name) {
          await chatkit.updateUser({
            id: req.user.id,
            name: req.body.name,
          });
        }
        return sendJSONresponse(res, 200, {
          success: true,
          msg: 'profile updated',
          body: req.body,
        });
      } else {
        const err = new APIError(
          'Method not found',
          httpStatus.NOT_FOUND,
        );
        return next(err);
      }
    })
    .catch(err => {
      return next(err);
    });
};

// let's logout
const logout = async (req, res) => {
  //let uid = req.account._id;
  // Delete user refresh token from Redis
  //redis.del(uid);
  // ... and then remove httpOnly cookies from browser
  //res.clearCookie('access_token');
  //res.clearCookie('refresh_token');
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
      const emailResponse = sendEmailForResetPassword(
        account.name,
        account.email,
        token,
      );
      return sendJSONresponse(res, 201, {
        success: true,
        token: token,
        message: 'Send Successfully to user',
        info,
      });
    })

    .catch(err => {
      return res.status(400).json({
        success: false,
        message: 'Email id does not exist',
      });
    });
};

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
        account.accountVerified = true;
        account.save(function(update_err, update_data) {
          if (update_err) {
            res.json({ success: false, error: update_err });
          } else {
            res.status(200).json({
              success: true,
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
          .json({ success: false, error: 'Link is expired' });
      });
  }
};

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

// const getAllAccounts = async (req, res) => {
//   console.log(req.user);
// };

const getAccount = async (req, res) => {
  return sendJSONresponse(res, 200, {
    success: true,
    user: req.user,
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

const searchAccount = async (req, res, next) => {
  const name = req.query.name;
  if (name === '') {
    const err = new BadRequestError(
      'Nothing Submitted',
      httpStatus.BAD_REQUEST,
      true,
    );
    logger.error(`Query Error: ${err}`);
    return next(err);
  }
  Account.find({ name: { $regex: new RegExp(name) } })
    .select('email name _id')
    .then(data => {
      if (data.length < 1) {
        const err = new SearchNotMatchError(
          'Query does not found',
          httpStatus.BAD_REQUEST,
          true,
        );
        logger.error(`Query Error: ${err}`);
        return next(err);
      } else {
        logger.info(`Search complete ${name}`);
        return sendJSONresponse(res, 200, {
          employees: {
            success: true,
            message: `Search complete ${name}`,
            data,
          },
        });
      }
    })
    .catch(() => {
      return next(err);
    });
};

const editAbout = async (req, res) => {
  Account.findByIdAndUpdate(
    { _id: req.user.id },
    { about: req.body.about },
  )
    .exec()
    .then(() => {
      logger.info('About update successful');
      return sendJSONresponse(res, 200, {
        success: true,
        msg: 'about update successful',
      });
    })
    .catch(() => {
      const err = new BadRequestError(
        'Nothing Submitted',
        httpStatus.BAD_REQUEST,
        true,
      );
      logger.error(`Error:${err} `);
      return next(err);
    });
};

// verify token
// const tokenVerification = async (req, res) => {
//   //const email = req.body.email;
//   const refreshToken = req.body.refreshToken;
//   const token = req.user.token;
//   if (token) {
//     jwt.verify(token, config.jwtSecret, (err, decoded) => {
//       if (err) {
//         // console.log(err);
//         return res
//           .status(401)
//           .json({ error: true, message: 'Unauthorized access' });
//       }
//       req.decoded = decoded;

//       next();
//     });
//   }
// };
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
  //getAllAccounts,
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
  //tokenVerification,
  searchAccount,
  editAbout,
};
