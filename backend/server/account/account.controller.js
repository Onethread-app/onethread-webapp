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
  sendEmailForVerifyAccount,
  sendEmailForResetPassword,
  inviteSignupEmail,
} = require('../services/email.services');
const {
  addTokenToBlackList,
  accountVerificationToken,
} = require('../services/redis.services');
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
  savePushSubscription,
  removePushSubscription,
} = require('../services/webpush.services');
const { Tasks } = require('elasticsearch');
const Task = require('../task/task.model');
const TaskAssign = require('../task/taskAssign.model');

const options = [
  {
    path: 'taskId',
    select: '_id name boardId columnId project dueDate status',
    populate: [
      {
        path: 'project',
        select: '_id name',
        populate: [
          {
            path: 'company',
            select: '_id uniqueName',
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
    select: '_id firstName lastName',
  },
  {
    path: 'assignedPerson',
    select: '_id firstName lastName',
  },
];

// get today's tasks for user
const getTodaysTask = async (req) => {
  try {
    let startToday = new Date(req.query.date);
    startToday.setHours(0, 0, 0, 0);
    let endToday = new Date();
    endToday.setHours(23, 59, 59, 999);
    const taskList = await Task.find({
      dueDate: { $gte: startToday, $lt: endToday },
    }).sort({ createdAt: -1 });
    let taskId = taskList.map((e) => e._id);
    const assignToUserToday = await TaskAssign.find({
      taskId: taskId,
      assignedPerson: req.user._id,
    })
      .select('taskId')
      .populate(options);
    const assignByUserToday = await TaskAssign.find({
      taskId: taskId,
      account: req.user._id,
      assignedPerson: { $nin: { _id: req.user._id } },
    })
      .sort({ createdAt: -1 })
      .select('taskId')
      .populate(options);

    const userTask = {
      assignToUser: [...assignToUserToday],
      assignByUser: [...assignByUserToday],
      totalTasks: assignToUserToday.length + assignByUserToday.length,
    };
    return userTask;
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

// get upcoming tasks for user
const getUpcomingTasks = async (req) => {
  try {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    let oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() + 7);
    const upcomingTask = await Task.find({
      dueDate: { $gte: tomorrow, $lte: oneWeek },
    }).sort({ createdAt: -1 });
    taskId = upcomingTask.map((e) => e._id);
    const assignToUserUpcoming = await TaskAssign.find({
      taskId: taskId,
      assignedPerson: req.user._id,
    })
      .select('taskId')
      .populate(options);
    const assignByUserUpcoming = await TaskAssign.find({
      taskId: taskId,
      account: req.user._id,
      assignedPerson: { $nin: { _id: req.user._id } },
    })
      .sort({ createdAt: -1 })
      .select('taskId')
      .populate(options);
    const userTask = {
      assignToUser: [...assignToUserUpcoming],
      assignByUser: [...assignByUserUpcoming],
      totalTasks:
        assignToUserUpcoming.length + assignByUserUpcoming.length,
    };
    return userTask;
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

// create a new account for individual users
const register = async (req, res, next) => {
  const data = req.body;
  if (!data.email || !data.password) {
    return sendJSONresponse(res, 400, {
      message: 'You must provide email and password.',
    });
  }
  let name = '';
  await Account.countDocuments({
    firstName: data.firstName,
    lastName: data.lastName,
  })
    .exec()
    .then((result) => {
      let firstName = createSlug(data.firstName);
      let lastName = createSlug(data.lastName);
      let uniqueId = result + 1;
      name = firstName + '-' + lastName + '-' + uniqueId;
    });
  let account = new Account({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    name: name,
    contactNo: Date.now(),
    password: data.password,
    birthDate: data.birthDate,
    isAccountVerified: data.isAccountVerified,
  });
  await account
    .save()
    .then(async (user) => {
      if (user.isAccountVerified)
        return sendJSONresponse(res, 201, {
          message: 'User created',
        });
      let token = crypto.randomBytes(20).toString('hex');
      let verifyToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      let verifyAccountTokenExpiration = Date.now() + 604800;

      let pendingMember = await PendingMember.find({
        email: account.email,
      }).select('-__v -createdAt -updatedAt');

      if (pendingMember.length > 0) {
        let pendingMemberToMember = pendingMember.map((m) => {
          return { account: account._id, company: m.company };
        });

        const pendingMemberToMemberAccounts =
          pendingMemberToMember.map((member) => member.account);
        const pendingMemberToMemberCompany =
          pendingMemberToMember.map((member) => member.company);

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

        await PendingMember.updateMany(
          { email: account.email },
          {
            removed: true,
          },
        );
      }

      sendEmailForVerifyAccount(
        user.firstName,
        user.lastName,
        user.email,
        verifyToken,
      );
      accountVerificationToken(
        `verifyAccountToken:${verifyToken}`,
        user._id,
        verifyAccountTokenExpiration,
      );
      return sendJSONresponse(res, 201, {
        message: 'User created',
        token: verifyToken,
      });
    })
    .catch((err) => {
      logger.error(`Account: ${err}`);
      next(err);
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
const login = async (req, res, next) => {
  try {
    const payLoad = {
      email: req.user.email,
      name: req.user.name,
      _id: req.user._id,
    };
    const accessToken = jwt.sign(payLoad, config.accessTokenSecret, {
      expiresIn: config.accessTokenExpire,
    });
    const refreshToken = jwt.sign(
      payLoad,
      config.refreshTokenSecret,
      {
        expiresIn: config.refreshTokenExpire,
      },
    );
    let userObj = {};
    userObj.name = req.user.name;
    // addUserDataIntoCache(req.user._id, req.user);
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
    let userInfo = await Account.findOne({
      _id: req.user._id,
    })
      .select('-password')
      .populate('skillArea', '_id name');
    let count = 0;
    if (userInfo.skillArea.length === 0) {
      count++;
    }
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
// client
//   .multi()
//   .get(`userID:${req.user.email}`)
//   .execAsync()
//   .then(result => {
//     let user = JSON.parse(result);
//     return sendJSONresponse(res, 200, {
//       success: true,
//       user: user,
//     });
//   })
//   .catch(err => {
//     console.log(err);
//     next(err);
//   });
const userDailyProgress = async (req, res, next) => {
  try {
    let startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    let endToday = new Date();
    endToday.setHours(23, 59, 59, 999);
    const taskList = await Task.find({
      dueDate: { $gte: startToday, $lt: endToday },
      status: { $ne: 'done' },
    });
    let taskId = taskList.map((e) => e._id);
    const assignTaskNumber = await TaskAssign.find({
      taskId: taskId,
      assignedPerson: req.user._id,
    }).countDocuments();
    const doneTaskList = await Task.find({
      dueDate: { $gte: startToday, $lt: endToday },
      status: 'done',
    });
    taskId = doneTaskList.map((e) => e._id);
    const completeNumber = await TaskAssign.find({
      taskId: taskId,
      assignedPerson: req.user._id,
    }).countDocuments();
    let dailyProgress = 0;
    if (assignTaskNumber === 0) {
      dailyProgress = 100;
    } else {
      dailyProgress = parseInt(
        ((completeNumber / assignTaskNumber) * 100).toFixed(2),
      );
    }

    return sendJSONresponse(res, 200, dailyProgress);
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};
const skillArea = async (req, res, next) => {
  try {
    const user = await Account.findOne({
      email: req.user.email,
    })
      .select('-password')
      .populate('skillArea', '_id name');
    return sendJSONresponse(res, 200, {
      success: true,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
// create a timeline for user
const timeline = async (req, res, next) => {
  try {
    const user = await Account.findOne({
      email: req.user.email,
    })
      .select('-password')
      .populate(
        'jobExperience education',
        '_id name companyName positionName currentlyWork startYear endingYear jobDescription degree institutionName eduDescription startYear endingYear currentlyStudy',
      );
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
    next(error);
  }
};
// token verification for mail
const getAccessTokenForVerifyAccount = async (req, res, next) => {
  try {
    let multi = client.multi();
    multi.get(`verifyAccountToken:${req.params.token}`);
    multi.exec(async (err, data) => {
      if (err) {
        logger.error(`${err}`);
        next(err);
      }
      let userID = JSON.parse(data[0]);
      if (typeof userID === 'string') {
        const user = await Account.findByIdAndUpdate(
          { _id: userID },
          { $set: { isAccountVerified: true } },
          { safe: true, upsert: true, new: true },
        ).exec();
        client.del(`verifyAccountToken:${req.params.token}`);
        await setDocument(accountIndex, '_doc', {
          mongo_id: user._id,
          name: user.name,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });

        logger.info(
          chalk.blueBright(
            `ElasticSearch document added on ${accountIndex}`,
          ),
        );
        return sendJSONresponse(res, 200, {
          isAccountVerified: true,
          message: 'Account Verified Successfully',
        });
      } else {
        return sendErrorResponse(res, 400, 'TokenExpireError', {
          isAccountVerified: false,
          message: 'Link is expired',
        });
      }
    });
  } catch (err) {
    next(err);
  }
};
// account holder can update their account information
const accountUpdate = async (req, res, next) => {
  await Account.findOneAndUpdate(
    {
      email: req.user.email,
    },
    req.body,
    {
      safe: true,
      upsert: true,
      new: true,
    },
  )
    .select('-password')
    .exec()
    .then(async (user) => {
      if (user) {
        // if (typeof user.about !== 'undefined') {
        //   client.hmset(`userID:${user._id}`, 'about', user.about);
        //   logger.info(`about added into ${user.email}'s cache`);
        // }
        // if (typeof user.location !== 'undefined') {
        //   client.hmset(
        //     `userID:${user._id}`,
        //     'location',
        //     user.location,
        //   );
        //   logger.info(`location added into ${user.email}'s cache`);
        // }
        // if (typeof user.gender !== 'undefined') {
        //   client.hmset(`userID:${user._id}`, 'gender', user.gender);
        //   logger.info(`gender added into ${user.email}'s cache`);
        // }
        // if (typeof user.bloodGroup !== 'undefined') {
        //   client.hmset(
        //     `userID:${user._id}`,
        //     'bloodGroup',
        //     user.bloodGroup,
        //   );
        //   logger.info(`bloodGroup added into ${user.email}'s cache`);
        // }
        // if (typeof user.position !== 'undefined') {
        //   client.hmset(
        //     `userID:${user._id}`,
        //     'position',
        //     user.position,
        //   );
        //   logger.info(`postion added into ${user.email}'s cache`);
        // }

        return sendJSONresponse(res, 200, {
          message: 'profile updated',
        });
      }
    })
    .catch((err) => {
      logger.error(`${err}`);
      next(err);
    });
};
const logout = async (req, res, next) => {
  try {
    let refreshToken = req.body.refreshToken;
    let accessToken = req.headers.authorization.split(' ')[1];
    let accessTokenExpire =
      req.user.exp * 1000 +
      new Date(req.user.exp * 1000).getTimezoneOffset() * 60 * 1000 -
      (Date.now() +
        new Date(Date.now()).getTimezoneOffset() * 60 * 1000);
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
          let refreshTokenExpire =
            user.exp * 1000 +
            new Date(user.exp * 1000).getTimezoneOffset() *
              60 *
              1000 -
            (Date.now() +
              new Date(Date.now()).getTimezoneOffset() * 60 * 1000);
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
      return sendErrorResponse(res, 404, 'UserNotFoundError', {
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
    accountVerificationToken(
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
    const { user } = req;
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
      return sendErrorResponse(res, 400, 'ValidationError', {
        message: `You can not use the same password`,
      });
    }
    await Account.findOne({
      email: user.email,
    }).exec((err, user) => {
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
          return sendErrorResponse(
            res,
            401,
            'PasswordValidationError',
            {
              message: `Your previous password is wrong`,
            },
          );
        }
      });
    });
  } catch (err) {
    next(err);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const resentType = req.body.resentType;
    const token = crypto.randomBytes(20).toString('hex');
    const verifyToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await Account.findOne({
      email: email,
    });
    if (!resentType) {
      return sendErrorResponse(res, 400, {
        message: 'Please provide resent-type',
      });
    }
    if (resentType === 'verify-account') {
      let verifyAccountTokenExpiration = Date.now() + 604800;
      sendEmailForVerifyAccount(
        user.firstName,
        user.lastName,
        user.email,
        verifyToken,
      );
      accountVerificationToken(
        `verifyAccountToken:${verifyToken}`,
        user._id,
        verifyAccountTokenExpiration,
      );
    }
    return sendJSONresponse(res, 200, {
      message: 'resend email successfully',
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const inviteSignup = async (req, res, next) => {
  try {
    const email = req.body.email;
    inviteSignupEmail(email);
    return sendJSONresponse(res, 200, {
      message:
        'Invitaion sent successfully. Please check your email.',
    });
  } catch (error) {
    logger.error(`Account: ${error}`);
    next(error);
  }
};

const userTaskList = async (req, res, next) => {
  try {
    const todaysTasks = await getTodaysTask(req);
    const upcomingTasks = await getUpcomingTasks(req);
    const userTask = { todaysTasks, upcomingTasks };
    return sendJSONresponse(res, 200, userTask);
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
module.exports = {
  register,
  resendEmail,
  login,
  logout,
  getAccessTokenForVerifyAccount,
  getAccount,
  timeline,
  accountUpdate,
  tokenRefresh,
  sendEmailForForgetPassword,
  resetPassword,
  changePassword,
  skillArea,
  inviteSignup,
  userTaskList,
  userDueTask,
  userDailyProgress,
};
