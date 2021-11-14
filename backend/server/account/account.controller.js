const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Account = require('./account.model');
const { Member } = require('../company/member/member.model');
const { Team } = require('../team-member/team.model');
const {
  PendingMember,
} = require('../company/member/pendingMember.model');
const config = require('../../config/config');
const logger = require('../../config/winston');
const client = require('../../index.redis');
const {
  sendEmailForResetPassword,
  signupMail,
} = require('../services/email.services');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const {
  setDocument,
  accountIndex,
  bulkInsert,
  memberIndex,
} = require('../services/elastic.services');
const chalk = require('chalk');
const { createSlug } = require('../helpers/SlugCreator');

const {
  getAssignedMembers,
  findTodaysTask,
  findAssignedNumberOfTasks,
} = require('../services/task/task.service');
const { sortTasksByStatus, getIds } = require('../helpers/utils');

const {
  getAllStatusInProject,
} = require('../services/task/taskStatus/taskStatus.service');

const {
  savePushSubscription,
  removePushSubscription,
} = require('../services/webpush.services');
const {
  findAccountById,
  findAccountByIdAndUpdate,
  createAccountWithEmail,
  findAccountByEmail,
  getVerifyToken,
  setVerifyToken,
  deleteVerifyToken,
  tokenVerify,
  addTokenToBlackList,
} = require('../services/account/account.service');
const Task = require('../task/task.model');
const SubTask = require('../task/subtask/subtask.model'); // TODO: REMOVE
const TaskAssign = require('../task/taskAssign.model');
const {
  subtaskPopulateOptionsForUser,
} = require('../helpers/PopulateOptions');

const {
  generateToken,
  validateEmail,
} = require('../utils/utils.controller');

const {
  findSubtasksByTaskId,
} = require('../services/task/task.service');

const options = [
  {
    path: 'taskId',
    select:
      '_id name account boardId columnId project dueDate status priority',
    populate: [
      {
        path: 'project',
        select: '_id name',
        populate: [
          {
            path: 'company',
            select: '_id uniqueName name',
          },
        ],
      },
      {
        path: 'boardId',
        select: '_id',
      },
      {
        path: 'columnId',
        select: '_id',
      },
    ],
  },
  {
    path: 'account',
    select: '_id firstName lastName profileImage',
  },
  {
    path: 'assignedPerson',
    select: '_id firstName lastName',
  },
];

const genAuthToken = (user) => {
  const payLoad = {
    email: user.email,
    name: user.name,
    _id: user._id,
  };
  const accessToken = jwt.sign(payLoad, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpire,
  });
  const refreshToken = jwt.sign(payLoad, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpire,
  });

  return [accessToken, refreshToken];
};

const makeUnqName = (firstName, lastName, c) => {
  return `${createSlug(firstName)}-${createSlug(lastName)}-${c + 1}`;
};

const removeSpecialChars = (str) => {
  return str.trim().replace(/[^a-zA-Z ]/g, '');
};

const storeAccountInELK = async (user) => {
  let pendingMember = await PendingMember.find({
    email: user.email,
  }).select('-__v -createdAt -updatedAt');

  if (pendingMember.length > 0) {
    let pendingMemberToMember = pendingMember.map((m) => {
      return {
        account: user._id,
        company: m.company,
        isApproved: true,
        approvedBy: m.createdBy,
      };
    });

    const pendingMemberToMemberAccounts = pendingMemberToMember.map(
      (member) => member.account,
    );
    const pendingMemberToMemberCompany = pendingMemberToMember.map(
      (member) => member.company,
    );

    await Member.create(pendingMemberToMember);

    const elasticIndexedMembers = await Member.find({
      account: { $in: pendingMemberToMemberAccounts },
      company: { $in: pendingMemberToMemberCompany },
    }).populate({
      path: 'account',
      select: '_id name firstName lastName email',
    });

    const memberStructure = (data) => {
      return {
        mongo_id: data.mongo_id,
        account: data.account,
        company: data.company,
      };
    };

    await bulkInsert(
      memberIndex,
      elasticIndexedMembers,
      memberStructure,
    );
    logger.info(
      chalk.blueBright(
        `ElasticSearch successfully documented with bulk on ${memberIndex}`,
      ),
    );

    await PendingMember.updateMany({ email }, { removed: true });
  }
};

const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = {
      hash: generateToken(),
      exp: Date.now() + 604800,
    };

    try {
      await signupMail(email, token.hash);
    } catch (err) {
      logger.error(`Mail Delivery Failure: ${err}`);
      return sendErrorResponse(res, 422, 'UnprocessableEntity', {
        message: 'Mail delivery failure',
      });
    }
    const user = await createAccountWithEmail(email);
    await setVerifyToken(token.hash, email, token.exp);
    return sendJSONresponse(res, 200, {
      message:
        'Invitaion sent successfully. Please check your email.',
      user,
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = {
      hash: generateToken(),
      exp: Date.now() + 604800,
    };
    try {
      await signupMail(email, token.hash);
    } catch (err) {
      logger.error(`Mail Delivery Failure: ${err}`);
      return sendErrorResponse(res, 422, 'UnprocessableEntity', {
        message: 'Mail delivery failure!',
      });
    }
    await setVerifyToken(token.hash, email, token.exp);
    return sendJSONresponse(res, 200, {
      message: 'resend email successfully',
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const changeEmail = async (req, res, next) => {
  try {
    const { previousEmail, newEmail } = req.body;

    const user = await findAccountByEmail(previousEmail);
    if (!user) {
      logger.error(`no user found with this email: ${previousEmail}`);
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'no user found',
      });
    }
    const isDuplicate = await findAccountByEmail(newEmail);
    if (isDuplicate) {
      logger.error(
        `user already exists with this email: ${newEmail}`,
      );
      return sendErrorResponse(res, 409, 'DuplicateKeyError', {
        message: 'user already exists',
      });
    }
    const token = {
      hash: generateToken(),
      exp: Date.now() + 604800,
    };
    try {
      await signupMail(newEmail, token.hash);
    } catch (err) {
      logger.error(err);
      return sendErrorResponse(res, 422, 'UnprocessableEntity', {
        message: 'Mail delivery failure',
      });
    }

    user.email = newEmail;
    user.isAccountVerified = false;
    await user.save();

    await setVerifyToken(token.hash, newEmail, token.exp);
    return sendJSONresponse(res, 200, {
      message:
        'Invitaion sent successfully. Please check your new email.',
      user,
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const registerInitiate = async (req, res, next) => {
  try {
    const { token } = req.query;
    getVerifyToken(token).exec(async (err, data) => {
      if (err) {
        logger.error(`${err}`);
        return next(err);
      }
      let email = data[0];
      if (validateEmail(email)) {
        const { firstName, lastName, password } = req.body;
        const count = await Account.countDocuments({
          firstName: removeSpecialChars(firstName),
          lastName: removeSpecialChars(lastName),
        });

        const user = await findAccountByEmail(email);
        if (!user) {
          logger.error(
            `no user found with this email: ${previousEmail}`,
          );
          return sendErrorResponse(res, 404, 'NotFound', {
            message: 'no user found',
          });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.name = makeUnqName(firstName, lastName, count);
        user.password = password;
        user.isAccountVerified = true;
        await user.save();

        await storeAccountInELK(user);
        await deleteVerifyToken(req.query.token);
        const [accessToken, refreshToken] = genAuthToken(user);

        return sendJSONresponse(res, 200, {
          message: 'Account Updated Successfully',
          accessToken,
          refreshToken,
          user,
        });
      } else {
        logger.error(`Link is expired`);
        return sendErrorResponse(res, 401, 'TokenExpireError', {
          message: 'Link is expired',
        });
      }
    });
  } catch (err) {
    logger.error(`${err}`);
    next(err);
  }
};

// account holder can update their account information
const accountUpdate = async (req, res, next) => {
  try {
    const user = await findAccountByIdAndUpdate(
      req.user._id,
      req.body,
    );
    return sendJSONresponse(res, 200, {
      message: 'profile updated',
      user,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// const getAccessTokenForVerifyAccount = async (req, res, next) => {
//   try {
//     // TODO: Check this token is blacklisted or not...
//     client
//       .multi()
//       .get(`verifyAccountToken:${req.params.token}`)
//       .exec(async (err, data) => {
//         if (err) {
//           logger.error(`${err}`);
//           return next(err);
//         }
//         let email = data[0];

//         if (typeof email === 'string') {
//           const user = await Account.findOneAndUpdate(
//             { email },
//             { $set: { isAccountVerified: true } },
//             { safe: true, upsert: true, new: true },
//           );
//           await client.del(`verifyAccountToken:${req.params.token}`);
//           await setDocument(accountIndex, '_doc', {
//             mongo_id: user._id,
//             name: user.name, // Random Token
//             email: user.email,
//             firstName: user.firstName, // Undefined
//             lastName: user.lastName, // Undefined
//           });
//           logger.info(
//             chalk.blueBright(
//               `ElasticSearch document added on ${accountIndex}`,
//             ),
//           );
//           const [accessToken, refreshToken] = genAuthToken(user);
//           return sendJSONresponse(res, 200, {
//             message: 'Account Verified Successfully',
//             accessToken,
//             refreshToken,
//           });
//         } else {
//           return sendErrorResponse(res, 401, 'TokenExpireError', {
//             isAccountVerified: false,
//             message: 'Link is expired',
//           });
//         }
//       });
//   } catch (err) {
//     logger.error(`Account: ${err}`);
//     next(err);
//   }
// };

// create a new account for individual users
// const register = async (req, res, next) => {
//   const data = req.body;
//   if (!data.email || !data.password) {
//     return sendJSONresponse(res, 400, {
//       message: 'You must provide email and password.',
//     });
//   }
//   const result = await Account.countDocuments({
//     firstName: data.firstName,
//     lastName: data.lastName,
//   });
//   let firstName = createSlug(data.firstName);
//   let lastName = createSlug(data.lastName);
//   let uniqueId = result + 1;
//   const name = firstName + '-' + lastName + '-' + uniqueId;
//   let account = new Account({
//     email: data.email,
//     firstName: data.firstName,
//     lastName: data.lastName,
//     name,
//     contactNo: Date.now(),
//     password: data.password,
//     isAccountVerified: false,
//   });
//   await account
//     .save()
//     .then(async (user) => {
//       if (user.isAccountVerified)
//         return sendJSONresponse(res, 201, {
//           message: 'User created',
//         });
//       let verifyToken = generateToken();
//       let verifyAccountTokenExpiration = Date.now() + 604800;

//       let pendingMember = await PendingMember.find({
//         email: account.email,
//       }).select('-__v -createdAt -updatedAt');

//       if (pendingMember.length > 0) {
//         let pendingMemberToMember = pendingMember.map((m) => {
//           return { account: account._id, company: m.company };
//         });

//         const pendingMemberToMemberAccounts =
//           pendingMemberToMember.map((member) => member.account);
//         const pendingMemberToMemberCompany =
//           pendingMemberToMember.map((member) => member.company);

//         await Member.create(pendingMemberToMember);

//         const elasticIndexedMembers = await Member.find({
//           account: { $in: pendingMemberToMemberAccounts },
//           company: { $in: pendingMemberToMemberCompany },
//         }).populate({
//           path: 'account',
//           select: '_id name firstName lastName email',
//         });

//         const memberStructure = (data) => {
//           return {
//             mongo_id: data.mongo_id,
//             account: data.account,
//             company: data.company,
//           };
//         };

//         await bulkInsert(
//           memberIndex,
//           elasticIndexedMembers,
//           memberStructure,
//         );
//         logger.info(
//           chalk.blueBright(
//             `ElasticSearch successfully documented with bulk on ${memberIndex}`,
//           ),
//         );

//         await PendingMember.updateMany(
//           { email: account.email },
//           {
//             removed: true,
//           },
//         );
//       }

//       sendEmailForVerifyAccount(
//         user.firstName,
//         user.lastName,
//         user.email,
//         verifyToken,
//       );
//       accountVerificationToken(
//         `verifyAccountToken:${verifyToken}`,
//         user._id,
//         verifyAccountTokenExpiration,
//       );
//       return sendJSONresponse(res, 201, {
//         message: 'User created',
//         token: verifyToken,
//       });
//     })
//     .catch((err) => {
//       logger.error(`Account: ${err}`);
//       next(err);
//     });
// };
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
    const [accessToken, refreshToken] = genAuthToken(req.user);
    let userObj = {};
    userObj.name = req.user.name;
    userObj.language = req.user.language || 'en';
    let pushSubscription;
    if (req.body.pushSubscription) {
      pushSubscription = await savePushSubscription(
        req.user._id,
        req.body.pushSubscription,
      );
    }
    return sendJSONresponse(res, 200, {
      success: true,
      accessToken,
      refreshToken,
      user: userObj,
      pushSubscription,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const getAccount = async (req, res, next) => {
  try {
    let userInfo = await findAccountById(req.user._id);
    let count = 0;

    if (userInfo.education.length === 0) {
      count++;
    }
    if (userInfo.jobExperience.length === 0) {
      count++;
    }
    if (userInfo.position === '' || userInfo.position === undefined) {
      count++;
    }
    if (userInfo.gender === '' || userInfo.gender === undefined) {
      count++;
    }
    if (
      userInfo.bloodGroup === '' ||
      userInfo.bloodGroup === undefined
    ) {
      count++;
    }
    if (userInfo.location === '' || userInfo.location === undefined) {
      count++;
    }
    if (userInfo.about === '' || userInfo.about === undefined) {
      count++;
    }
    let compilation = ((count / 12) * 100).toFixed(2);
    let teamNumber = await Team.find({
      account: req.user._id,
    }).countDocuments();
    userInfo = {
      ...userInfo._doc,
      complete: compilation,
      teamNumber: teamNumber,
    };
    return sendJSONresponse(res, 200, {
      success: true,
      user: userInfo,
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

// TODO: Recheck
const userDailyProgress = async (req, res, next) => {
  try {
    // not completed tasks
    const taskList = await findTodaysTask(false);
    let taskId = getIds(taskList);
    // not completed - number of assigned task
    const notComAssignedTask = await findAssignedNumberOfTasks(
      taskId,
      req.user._id,
    );

    // completed tasks
    const doneTaskList = await findTodaysTask(true);
    taskId = getIds(doneTaskList);
    // completed - number of assigned task
    const comAssignedTask = await findAssignedNumberOfTasks(
      taskId,
      req.user._id,
    );
    let dailyProgress = 0;
    if (notComAssignedTask === 0) {
      dailyProgress = 100;
    } else {
      dailyProgress = comAssignedTask / notComAssignedTask;
      dailyProgress = parseInt((dailyProgress * 100).toFixed(2));
    }

    return sendJSONresponse(res, 200, dailyProgress);
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const skillArea = async (req, res, next) => {
  try {
    const user = await findAccountById(req.user._id);
    return sendJSONresponse(res, 200, {
      success: true,
      user: user,
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};
// create a timeline for user
const timeline = async (req, res, next) => {
  try {
    const user = await findAccountById(req.user._id);
    const timeline = [...user.jobExperience, ...user.education];
    const timelineHistory = timeline.sort((a, b) =>
      a.startYear < b.startYear ? 1 : -1,
    );
    const userInfo = {};
    userInfo.timeline = timelineHistory;
    return sendJSONresponse(res, 200, {
      success: true,
      user: userInfo,
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};
// token verification for mail
// const getAccessTokenForVerifyAccount = async (req, res, next) => {
//   try {
//     let multi = client.multi();
//     multi.get(`verifyAccountToken:${req.params.token}`);
//     multi.exec(async (err, data) => {
//       if (err) {
//         logger.error(`${err}`);
//         next(err);
//       }
//       let userID = JSON.parse(data[0]);
//       if (typeof userID === 'string') {
//         const user = await Account.findByIdAndUpdate(
//           { _id: userID },
//           { $set: { isAccountVerified: true } },
//           { safe: true, upsert: true, new: true },
//         ).exec();
//         client.del(`verifyAccountToken:${req.params.token}`);
//         await setDocument(accountIndex, '_doc', {
//           mongo_id: user._id,
//           name: user.name,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//         });

//         logger.info(
//           chalk.blueBright(
//             `ElasticSearch document added on ${accountIndex}`,
//           ),
//         );
//         return sendJSONresponse(res, 200, {
//           isAccountVerified: true,
//           message: 'Account Verified Successfully',
//         });
//       } else {
//         return sendErrorResponse(res, 400, 'TokenExpireError', {
//           isAccountVerified: false,
//           message: 'Link is expired',
//         });
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// // account holder can update their account information
// const accountUpdate = async (req, res, next) => {
//   try {
//     await findAccountByIdAndUpdate(req.user._id, req.body);
//     return sendJSONresponse(res, 200, {
//       message: 'profile updated',
//     });
//   } catch (error) {
//     logger.error(`${error}`);
//     next(error);
//   }
// };

const getExpireTime = (exp) => {
  return (
    exp * 1000 +
    new Date(exp * 1000).getTimezoneOffset() * 60 * 1000 -
    (Date.now() +
      new Date(Date.now()).getTimezoneOffset() * 60 * 1000)
  );
};

const logout = async (req, res, next) => {
  try {
    let refreshToken = req.body.refreshToken;
    let accessToken = req.headers.authorization.split(' ')[1];
    let accessTokenExpire = getExpireTime(req.user.exp);
    if (refreshToken) {
      await jwt.verify(
        refreshToken,
        config.refreshTokenSecret,
        async (err, user) => {
          if (err) {
            return sendErrorResponse(res, 401, 'AuthError', {
              message: err.message,
              fieldName: 'headers',
            });
          }
          let refreshTokenExpire = getExpireTime(user.exp);
          addTokenToBlackList(accessToken, accessTokenExpire);
          addTokenToBlackList(refreshToken, refreshTokenExpire);

          await removePushSubscription(req.body.subscriptionId);

          logger.info('Account successfully Logout');
          return sendJSONresponse(res, 200, {
            success: true,
            message: 'Successfully logout',
          });
        },
      );
    }
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const sendEmailForForgetPassword = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(20).toString('hex');
    const verifyToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await Account.findOne({
      email: req.body.email,
    });
    if (!user)
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'no user found',
        fieldName: 'email',
      });
    sendEmailForResetPassword(
      user.firstName,
      user.lastName,
      user.email,
      verifyToken,
    );
    let resetPasswordTokenExpiration = Date.now() + 86400; // 1 day
    await tokenVerify(
      `resetPasswordToken:${verifyToken}`,
      user._id,
      resetPasswordTokenExpiration,
    );
    logger.info(`send reset password mail to user successfully`);
    return sendJSONresponse(res, 200, {
      message: 'Mail send successfully',
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password, token } = req.body;
    let multi = client.multi();
    multi.get(`resetPasswordToken:${token}`);
    multi.exec(async (err, data) => {
      if (err) {
        logger.error(`${err}`);
        next(err);
      }
      let userID = JSON.parse(data[0]);
      if (typeof userID === 'string') {
        const user = await Account.findById({
          _id: userID,
        });
        user.password = password;
        await user.save();
        logger.info(`password successfully change`);
        client.del(`resetPasswordToken:${token}`);
        logger.info(`delete reset password token from tokenList`);
        return sendJSONresponse(res, 200, {
          message: 'Password Changed',
        });
      } else {
        return sendErrorResponse(res, 401, 'TokenExpireError', {
          message: 'Time is expired',
        });
      }
    });
  } catch (err) {
    logger.error(`password does not change`);
    next(err);
  }
};

const tokenRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    // check if a refresh token exist in blacklist
    let isBlackListed;
    let multi = client.multi();
    multi.get(`BlackList:${refreshToken}`);
    multi.exec(function (err, data) {
      // if data object is null token is not blacklisted
      if (data[0] === null) {
        isBlackListed = false;
      } else {
        isBlackListed = true;
      }
    });

    if (isBlackListed) {
      return sendErrorResponse(res, 401, 'AuthError', {
        message: 'invalid token',
      });
    } else {
      await jwt.verify(
        refreshToken,
        config.refreshTokenSecret,
        async function (err, user) {
          if (err) {
            return sendErrorResponse(res, 401, 'AuthError', {
              message: err.message,
            });
          }
          const payLoad = {
            email: user.email,
            _id: user._id,
            name: user.name,
          };
          // convert to msec
          // add local time zone offset
          // get UTC time in msec
          // create new Date object for different city
          const refreshTokenExpire =
            user.exp * 1000 +
            new Date(user.exp * 1000).getTimezoneOffset() *
              60 *
              1000 -
            (Date.now() +
              new Date(Date.now()).getTimezoneOffset() * 60 * 1000);
          const oldAccessToken = req.body.accessToken;
          await jwt.verify(
            oldAccessToken,
            config.accessTokenSecret,
            (err, verified) => {
              // if access token expired
              // add refresh token in blacklist
              // make new access and refresh token
              if (err) {
                addTokenToBlackList(refreshToken, refreshTokenExpire);
                const accessToken = jwt.sign(
                  payLoad,
                  config.accessTokenSecret,
                  {
                    expiresIn: config.accessTokenExpire,
                  },
                );
                const newRefreshToken = jwt.sign(
                  payLoad,
                  config.refreshTokenSecret,
                  {
                    expiresIn: config.refreshTokenExpire,
                  },
                );
                const response = {
                  accessToken: accessToken,
                  token_type: 'Bearer',
                  refreshToken: newRefreshToken,
                };
                return sendJSONresponse(res, 200, response);
              } else {
                let oldAccessTokenExpire =
                  verified.exp * 1000 +
                  new Date(verified.exp * 1000).getTimezoneOffset() *
                    60 *
                    1000 -
                  (Date.now() +
                    new Date(Date.now()).getTimezoneOffset() *
                      60 *
                      1000);
                addTokenToBlackList(
                  oldAccessToken,
                  oldAccessTokenExpire,
                );
                addTokenToBlackList(refreshToken, refreshTokenExpire);
                const accessToken = jwt.sign(
                  payLoad,
                  config.accessTokenSecret,
                  {
                    expiresIn: config.accessTokenExpire,
                  },
                );
                const newRefreshToken = jwt.sign(
                  payLoad,
                  config.refreshTokenSecret,
                  {
                    expiresIn: config.refreshTokenExpire,
                  },
                );
                const response = {
                  accessToken: accessToken,
                  token_type: 'Bearer',
                  refreshToken: newRefreshToken,
                };
                return sendJSONresponse(res, 200, response);
              }
            },
          );
        },
      );
    }
  } catch (err) {
    logger.error(`${err}`);
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // if (oldPassword === newPassword) {
    //   return sendErrorResponse(res, 400, 'ValidationError', {
    //     message: `You can not use the same password`,
    //   });
    // }
    const user = await Account.findOne({
      email: req.user.email,
    });
    const isMatched = await user.comparePassword(oldPassword);
    if (isMatched) {
      user.password = newPassword;
      await user.save();
      return sendJSONresponse(res, 200, {
        message: 'Password changed successfully',
      });
    } else {
      return sendErrorResponse(res, 401, 'PasswordValidationError', {
        message: `Your previous password is wrong`,
      });
    }
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

// TODO: Recheck
const userTaskList = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const tasks = await TaskAssign.find({
      $or: [
        { account: req.user._id },
        { assignedPerson: req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .select('taskId')
      .populate(options);
    const filteredTask = tasks.filter(
      (task) => task.taskId !== null && task.taskId.status !== 'done',
    );

    const response = [];
    await Promise.all(
      filteredTask.map(async (ft) => {
        const taskMembers = await getAssignedMembers(ft.taskId._id);
        const members = taskMembers.map((tMember) => {
          return tMember.assignedPerson;
        });

        const statusList = await getAllStatusInProject(
          task.project._id,
        );

        const modifiedTask = {
          _id: ft.taskId._id,
          name: ft.taskId.name,
          account: {
            _id: ft.account._id,
            firstName: ft.account.firstName,
            lastName: ft.account.lastName,
            name: ft.account.name,
            profileImage: ft.account.profileImage,
          },
          status: ft.taskId.status,
          dueDate: ft.taskId.dueDate,
          boardId: ft.taskId.boardId._id,
          priority: ft.taskId.priority,
          members,
          createdAt: ft.taskId.createdAt,
          statusList,
          project: {
            _id: ft.taskId.project._id,
            name: ft.taskId.project.name,
          },
          company: {
            _id: ft.taskId.project.company._id,
            uniqueName: ft.taskId.project.company.uniqueName,
            name: ft.taskId.project.company.name,
          },
          subtasks: await findSubtasksByTaskId(ft.taskId._id),
        };
        response.push(modifiedTask);
      }),
    );
    const sortedTasks = sortTasksByStatus(response);

    return sendJSONresponse(res, 200, sortedTasks);
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const userDueTask = async (req, res, next) => {
  try {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesWeek = new Date();
    yesWeek.setDate(yesWeek.getDate() - 7);
    const dueTask = await Task.find({
      dueDate: { $lt: yesterday, $gte: yesWeek },
      status: { $ne: 'done' },
      parentTask: null,
    }).sort({ createdAt: -1 });
    taskId = dueTask.map((e) => e._id);
    const assignToUserDue = await TaskAssign.find({
      taskId: taskId,
      assignedPerson: req.user._id,
    })
      .select('taskId')
      .populate(options);
    const assignByUserDue = await TaskAssign.find({
      taskId: taskId,
      account: req.user._id,
      assignedPerson: { $nin: { _id: req.user._id } },
    })
      .sort({ createdAt: -1 })
      .select('taskId')
      .populate(options);
    const userTask = {
      assignToUserDue: [...assignToUserDue],
      assignByUserDue: [...assignByUserDue],
    };
    return sendJSONresponse(res, 200, userTask);
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const userSubtasks = async (req, res, next) => {
  try {
    const subtasksAssignedToUser = await SubTask.find({
      assignedMembers: { $in: { _id: req.user._id } },
      done: false,
    })
      .select('_id taskId name dueDate')
      .populate(subtaskPopulateOptionsForUser)
      .exec();
    sendJSONresponse(res, 200, subtasksAssignedToUser);
  } catch (error) {
    logger.error(`Subtask for users: ${error}`);
    next(error);
  }
};

const subtaskMarkAsDone = async (req, res, next) => {
  try {
    const subtask = await SubTask.findByIdAndUpdate(
      { _id: req.params.subTaskId },
      { done: req.body.done },
      { new: true },
    );
    sendJSONresponse(res, 200, {
      message: `Subtask ${subtask.name} marked as ${
        req.body.done === true ? 'done' : 'not done'
      }`,
    });
  } catch (error) {
    logger.error(`Subtask: ${error}`);
    next(error);
  }
};

const saveLanguage = async (req, res, next) => {
  try {
    await Account.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $set: { language: req.body.language },
      },
      { upsert: true, new: true },
    );

    return sendJSONresponse(res, 200, {
      message: 'language updated',
    });
  } catch {
    logger.error(`report: ${error}`);
    next(error);
  }
};

const updateEmail = async (req, res, next) => {
  try {
    await Account.findByIdAndUpdate(
      {
        _id: req.body.id,
      },
      {
        $set: { email: req.body.email },
      },
      { upsert: true, new: true },
    );
    const token = {
      hash: generateToken(),
      exp: Date.now() + 604800,
    };

    try {
      await signupMail(req.body.email, token.hash);
    } catch (err) {
      logger.error(err);
      return sendJSONresponse(res, 422, {
        message: 'Mail delivery failure!',
      });
    }
    // TODO: blacklist token for old email address.
    await tokenVerify(
      `verifyAccountToken:${token.hash}`,
      req.body.email,
      token.exp,
    );
    return sendJSONresponse(res, 200, {
      message: 'Email updated',
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

module.exports = {
  // register,
  resendEmail,
  login,
  logout,
  accountUpdate,
  // getAccessTokenForVerifyAccount,
  getAccount,
  timeline,
  registerInitiate,
  tokenRefresh,
  sendEmailForForgetPassword,
  resetPassword,
  changePassword,
  skillArea,
  signup,
  userTaskList,
  userSubtasks,
  subtaskMarkAsDone,
  userDueTask,
  userDailyProgress,
  saveLanguage,
  updateEmail,
  changeEmail,
};
