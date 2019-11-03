const jwt = require('jsonwebtoken');
const crypto = require('crypto');
<<<<<<< HEAD
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const shortid = require('shortid');
const Account = require('./account.model');
const config = require('../../config/config');
=======
const httpStatus = require('http-status');
const shortid = require('shortid');

const Account = require('./account.model');
const config = require('../../config/config');

>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
const {
  sendEmailForVerifyAccount,
  sendEmailForResetPassword,
} = require('../services/email.services');
const { chatkit } = require('../services/pusher.services');
const {
  addRefreshTokenToList,
  updateRefreshTokenfromList,
  removeRefreshTokenfromList,
} = require('../services/redis.services');
const { sendJSONresponse } = require('../helpers/jsonResponse');
<<<<<<< HEAD
=======
const { webhook } = require('../services/slack.services.js');

>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
const {
  APIError,
  EmailIdExistError,
  BadRequestError,
  SearchNotMatchError,
} = require('../helpers/APIError');

const logger = require('../../config/winston');
const client = require('../../index.redis');
const { imageUpload } = require('../image/image.controller');

// create a new account for individual users
const register = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const contactNo = req.body.contactNo;
  const role = req.body.role;
<<<<<<< HEAD
  const uniqueHash = shortid.generate();
  const name = firstName + uniqueHash;
  if (!email || !password) {
    return sendJSONresponse(res, 400, {
=======

  const uniqueHash = shortid.generate();
  const name = firstName + uniqueHash;
  if (!email || !password) {
    return sendJSONresponse(res, 422, {
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
      error: 'You must provide email and password.',
    });
  }

  Account.find({
    email: email,
  })
<<<<<<< HEAD
=======
    .select('-password')
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
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
<<<<<<< HEAD
        account.save().then(async userInfo => {
=======
        account.save().then(async user => {
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
          const info = {};
          info.account = account;
          info.expires = new Date(
            // expire within 1 month
            new Date().getTime() + 2630000,
          );
<<<<<<< HEAD
          let access_token = jwt.sign(info, config.jwtSecret, {
=======
          const infoObj = info.account.toObject();
          delete infoObj.password;
          const accessToken = jwt.sign(info, config.jwtSecret, {
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
            expiresIn: '1d',
          });
          const emailResponse = await sendEmailForVerifyAccount(
            account.name,
            account.email,
<<<<<<< HEAD
            access_token,
          );
          delete account.password;
          delete account.companies;
          req.login(userInfo, async function(err) {
=======
            accessToken,
          );
          req.login(user, async function(err) {
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
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
<<<<<<< HEAD
              const user = userInfo.toObject();
              user.token = account.generateJwt();
              delete user.password;
              return sendJSONresponse(res, 201, {
                success: true,
                token: user.token,
                message: 'User created',
                user,
=======
              return sendJSONresponse(res, 201, {
                success: true,
                message: 'User created',
                emailResponse,
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
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
<<<<<<< HEAD
      next(error);
    });
};
=======
      return next(error);
    });
};

>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
/**
 * Returns jwt token if valid uname and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {* token}
 */

// account holder can login their account
const login = async (req, res, next) => {
  try {
    const payLoad = {
      email: req.user,
    };
    const token = jwt.sign({ _id: req.user._id }, config.jwtSecret, {
      expiresIn: 60 * 60 * 60 * 24,
    });
    const accessToken = jwt.sign(payLoad, config.jwtSecret, {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign(
      payLoad,
      config.refreshTokenSecret,
      {
        expiresIn: '48h',
      },
    );

    const userObj = req.user.toObject();
    const timeline = [
      ...req.user.jobExperience,
      ...req.user.education,
    ];
    const timelineHistory = timeline.sort((a, b) =>
      a.startYear < b.startYear ? 1 : -1,
    );
    userObj.timeline = timelineHistory;
    delete userObj.password;
<<<<<<< HEAD
    delete userObj.companies;
    delete userObj.friends;
    delete userObj.pendingFriends;
    delete userObj.sendingFriendList;
=======
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
    addRefreshTokenToList(refreshToken, req.user, accessToken, 100);
    return sendJSONresponse(res, 200, {
      success: true,
      user: userObj,
      token: token,
      refresh_token: refreshToken,
    });
  } catch (error) {
    logger.error(`ReferenceError:${error} is not defined`);
    next(error);
  }
};

// token verification for mail
<<<<<<< HEAD
const getAccessTokenForVerifyAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await Account.findOne({
      verifyAccountToken: token,
    }).select(
      '-password companies contactNo skillArea education name',
    );
    if (!user)
      return sendJSONresponse(res, 400, { message: 'No User Found' });
    user.verifyAccountToken = undefined;
    user.accountVerified = true;
    const dbSavedUser = await user.save();
    return sendJSONresponse(res, 200, {
      success: true,
=======
const getAccessTokenForVerifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await Account.findOne({
      _id: req.user._id,
      verifyAccountToken: token,
    });
    if (!user)
      return res.status(400).json({ message: 'No User Found' });
    user.verifyAccountToken = undefined;
    user.isAccountVerified = true;
    const dbSavedUser = await user.save();
    return res.json({
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
      message: 'Account Verified Successfully',
      user: dbSavedUser,
    });
  } catch (err) {
<<<<<<< HEAD
    next(err);
=======
    return res.status(500).json({
      message: 'server error',
    });
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
  }
};
// account holder can update their account information
const accountUpdate = async (req, res, next) => {
  Account.findByIdAndUpdate({ _id: req.user.id }, req.body)
    .select('-password')
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
const logout = async (req, res) => {
  req.logout();
<<<<<<< HEAD
  logger.info('Account successfully Logout');
  return sendJSONresponse(res, 200, {
    success: true,
    message: 'Successfully logout',
  });
=======
  res.json({
    success: true,
    msg: 'You are successfully logout',
  });
  res.end();
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
};

const sendEmailForForgetPassword = async (req, res, next) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) return res.status(400).json(err);
      const token = buffer.toString('hex');
      const user = await Account.findOne({
        email: req.body.email,
<<<<<<< HEAD
      }).select('-password');
=======
      });
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
      if (!user)
        return sendJSONresponse(res, 400, {
          success: false,
          message: 'no user found',
        });
      user.resetPasswordToken = token;
      user.resetPasswordTokenExpiration = Date.now() + 3600000;
      const dbSavedUser = await user.save();
      const emailResponse = await sendEmailForResetPassword(
        user.name,
        user.email,
        token,
      );
<<<<<<< HEAD
      return sendJSONresponse(res, 200, {
        dbSavedUser,
        emailResponse,
      });
=======
      return res.status(200).json({ dbSavedUser, emailResponse });
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
    });
  } catch (error) {
    next(error);
  }
};

const getAccessTokenForForgetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await Account.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    }).select('-password');
    if (!user)
      return sendJSONresponse(res, 400, {
        message: 'token time expired',
      });
    return sendJSONresponse(res, 200, {
      message: 'Now I get the permission to change the password',
      user,
    });
  } catch (err) {
    next(err);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { password, userID } = req.body;
    const user = await Account.findOne({ _id: userID }).select(
      '-password',
    );
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiration = undefined;
    user.accountVerified = true;
    user.password = password;
    const dbSavedUser = await user.save();
    delete dbSavedUser.password;
<<<<<<< HEAD
    logger.info(`password change`);
    return sendJSONresponse(res, 200, {
=======
    return res.status(200).json({
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
      message: 'Password Changed',
      user: dbSavedUser,
    });
  } catch (err) {
<<<<<<< HEAD
    logger.error(`password does not change`);
    next(err);
  }
};
=======
    next(err);
  }
};

// verifying mail address
// const verifyAccount = async (req, res) => {
//   let token = req.params.token;
//   let data = jwt.decode(token, config.jwtSecret);
//   if (new Date(data.expires) > new Date()) {
//     Account.findOne({
//       _id: data.account._id,
//       email: data.account.email,
//     })
//       .select('-password')
//       .exec(function(err, account) {
//         if (err) {
//           console.log(err);
//           res.json(err);
//         } else if (!account) {
//           console.log('Account not found');
//           res.json({ error: 'Account not found' });
//         } else {
//           account.accountVerified = true;
//           account.save(function(update_err, update_data) {
//             if (update_err) {
//               res.json({ success: false, error: update_err });
//             } else {
//               res.status(200).json({
//                 success: true,
//                 message: 'Account is verified',
//               });
//             }
//           });
//         }
//       });
//   } else {
//     Account.deleteOne({ _id: data.account._id })
//       .then(account => {
//         return;
//       })
//       .catch(err => {
//         return res
//           .status(200)
//           .json({ success: false, error: 'Link is expired' });
//       });
//   }
// };

// send friend request to an account
const sendFriendRequest = async (req, res, next) => {
  let fromFriend = req.user.id;
  let toFriend = req.query.userID;

  // you can not add yourself
  if (fromFriend === toFriend) {
    return sendJSONresponse(res, 400, {
      success: false,
      message: 'You can not add yourself',
    });
  }
  Account.findById(fromFriend)
    .select('-password')
    .then(account => {
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
const pendingFriendRequestList = async (req, res, next) => {
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
const acceptFriendRequest = async (req, res, next) => {
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
const friendList = async (req, res, next) => {
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
      next(err);
    });
};

// sending Friend request List
const sendFriendRequestList = async (req, res, next) => {
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

>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
const getAccount = async (req, res, next) => {
  try {
    const timeline = [
      ...req.user.jobExperience,
      ...req.user.education,
    ];
    const timelineHistory = timeline.sort((a, b) =>
      a.startYear < b.startYear ? 1 : -1,
    );
    const userInfo = { ...req.user._doc };
    userInfo.timeline = timelineHistory;
    delete userInfo.password;
    delete userInfo.companies;
<<<<<<< HEAD
    logger.info('userInfo successfully fetched');
=======
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
    return sendJSONresponse(res, 200, {
      success: true,
      user: userInfo,
    });
  } catch (error) {
    logger.error(`ReferenceError:${error} is not defined`);
    return next(error);
  }
};

const accountLoad = async (req, res, next, id) => {
  Account.findById(id)
    .select('-password')
    .exec()
    .then(result => {
      if (result) {
        logger.info(`${result} account successfully load`);
        req.account = result;
        next();
      } else {
        logger.warn(`No valid entry for provided id`);
<<<<<<< HEAD
        return sendJSONresponse(res, 400, {
          message: `no valid entry found for id`,
=======
        return res.status(400).json({
          message: 'No valid entry found for provided ID',
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
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
    .catch(err => {
      return next(err);
    });
};

const tokenRefresh = async (req, res, next) => {
  const refreshToken = req.body.refresh_token;
  if (refreshToken) {
    client.exists(refreshToken, function(err, exists) {
      if (exists) {
        let refreshTokenPayload;
        jwt.verify(refreshToken, config.refreshTokenSecret, function(
          err,
          user,
        ) {
          if (err) {
            console.log(err);
            return res.status(401).json({
              statusCode: 401,
              error: 'Unauthorized',
              message: err.message,
            });
          }
          refreshTokenPayload = user;
        });
        const payload = {
          email: refreshTokenPayload.email,
        };
        const accessToken = jwt.sign(
          payload,
          config.accessTokenSecret,
          { expiresIn: '1d' },
        );
        const response = {
          access_token: accessToken,
          expires_in: '1d',
          token_type: 'Bearer',
        };
        updateRefreshTokenfromList(refreshToken, accessToken);
        return sendJSONresponse(res, 200, response);
      } else {
        logger.error('The refresh token does not exist');
        return sendJSONresponse(res, 401, {
          error: 'Unauthorized',
          message: 'The refresh token does not exist',
        });
      }
    });
  } else {
    logger.error(
      `The required parameters were not sent in the request`,
    );
    return sendJSONresponse(res, 401, {
      error: 'Bad Request',
      message: 'The required parameters were not sent in the request',
    });
  }
};

const tokenRevoke = async (req, res, next) => {
  const refreshToken = req.body.refresh_token;
  if (refreshToken) {
    client.exists(refreshToken, function(err, exists) {
      if (exists) {
        removeRefreshTokenfromList(refreshToken);
        res.sendStatus(204);
      } else {
        res.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'The refresh token does not exist',
        });
      }
    });
  } else {
    res.status(401).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'The required parameters were not sent in the request',
    });
  }
};

<<<<<<< HEAD
const changePassword = async (req, res, next) => {
  try {
    const { user } = req;
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
      return sendJSONresponse(res, 400, {
        message: `you can not use the same password`,
      });
    }
    await Account.findOne({ email: user.email }).exec((err, user) => {
      if (err) {
        next(err);
      }
      user.comparePassword(oldPassword, async (err, isMatched) => {
        if (err) {
          return next(err);
        }
        if (isMatched) {
          user.password = newPassword;
          await user.save();
          return sendJSONresponse(res, 200, {
            message: 'Password changed successfully',
          });
        } else {
          return sendJSONresponse(res, 401, {
            message: `your previous password is wrong.`,
          });
        }
      });
    });
  } catch (err) {
    next(err);
  }
};

=======
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
module.exports = {
  register,
  login,
  logout,
  getAccessTokenForVerifyAccount,
<<<<<<< HEAD
  getAccount,
  accountLoad,
  accountUpdate,
=======
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
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
  searchAccount,
  tokenRefresh,
  tokenRevoke,
  sendEmailForForgetPassword,
  getAccessTokenForForgetPassword,
  resetPassword,
<<<<<<< HEAD
  changePassword,
};

=======
};
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
