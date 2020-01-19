const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const httpStatus = require('http-status');
const Account = require('./account.model');
const config = require('../../config/config');
const logger = require('../../config/winston');
const client = require('../../index.redis');
const {
  sendEmailForVerifyAccount,
  sendEmailForResetPassword,
} = require('../services/email.services');
const { chatkit } = require('../services/pusher.services');
const {
  updateRefreshTokenfromList,
  removeRefreshTokenfromList,
} = require('../services/redis.services');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const {
  APIError,
  BadRequestError,
  SearchNotMatchError,
} = require('../helpers/APIError');
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
    .then(result => {
      let uniqueId = result + 1;
      name = data.firstName + '.' + data.lastName + '.' + uniqueId;
    });
  let account = new Account({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    name: name,
    contactNo: data.contactNo,
    password: data.password,
  });
  account
    .save()
    .then(async user => {
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) return res.status(400).json(err);
        const token = buffer.toString('hex');
        user.verifyAccountToken = token;
        user.verifyAccountTokenExpiration = Date.now() + 259200;
        await user.save();
        const emailResponse = sendEmailForVerifyAccount(
          user.name,
          user.email,
          token,
          next,
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
              id: user._id,
              name: user.name,
            });
            user.token = jwt.sign(
              {
                email: req.user.email,
                _id: req.user._id,
              },
              config.accessTokenSecret,
              {
                expiresIn: '45m',
              },
            );
            delete user.password;
            return sendJSONresponse(res, 201, {
              token: user.token,
              message: 'User created',
              user,
            });
          }
        });
      });
    })
    .catch(err => {
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
      _id: req.user._id,
    };
    const token = jwt.sign(
      { email: req.user.email, _id: req.user._id },
      config.jwtSecret,
      {
        expiresIn: 60 * 60 * 60 * 24,
      },
    );
    const accessToken = jwt.sign(payLoad, config.accessTokenSecret, {
      expiresIn: '45m',
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
    delete userObj.companies;
    return sendJSONresponse(res, 200, {
      success: true,
      user: userObj,
      token: token,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const getAccount = async (req, res, next) => {
  try {
    const user = await Account.findOne({
      email: req.user.email,
    })
      .select('-password')
      .populate(
        'companies skillArea jobExperience education profileImage coverImage',
        '_id name companyName positionName currentlyWork startYear endingYear jobDescription degree institutionName eduDescription startYear endingYear currentlyStudy name fileLink s3Key fileType imageType',
      );
    const timeline = [...user.jobExperience, ...user.education];
    const timelineHistory = timeline.sort((a, b) =>
      a.startYear < b.startYear ? 1 : -1,
    );
    const userInfo = { ...user._doc };
    userInfo.timeline = timelineHistory;
    delete userInfo.password;
    delete userInfo.companies;
    logger.info('userInfo successfully fetched');
    return sendJSONresponse(res, 200, {
      success: true,
      user: userInfo,
    });
  } catch (error) {
    return next(error);
  }
};

// token verification for mail
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
      message: 'Account Verified Successfully',
      user: dbSavedUser,
    });
  } catch (err) {
    next(err);
  }
};
// account holder can update their account information
const accountUpdate = async (req, res, next) => {
  await Account.findOneAndUpdate(
    { email: req.user.email },
    req.body,
    { safe: true, upsert: true, new: true },
  )
    .select('-password')
    .exec()
    .then(async user => {
      if (user) {
        if (req.body.name !== user.name) {
          await chatkit.updateUser({
            id: user._id,
            name: req.body.name,
          });
        }
        return sendJSONresponse(res, 200, {
          message: 'profile updated',
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
  logger.info('Account successfully Logout');
  return sendJSONresponse(res, 200, {
    success: true,
    message: 'Successfully logout',
  });
};

const sendEmailForForgetPassword = async (req, res, next) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) return res.status(400).json(err);
      const token = buffer.toString('hex');
      const user = await Account.findOne({
        email: req.body.email,
      }).select('-password');
      if (!user)
        return sendErrorResponse(res, 404, '', {
          message: 'no user found',
          fieldName: 'email',
        });
      user.resetPasswordToken = token;
      user.resetPasswordTokenExpiration = Date.now() + 3600000;
      await user.save();
      const emailResponse = sendEmailForResetPassword(
        user.name,
        user.email,
        token,
        next,
      );
      logger.info(`send reset password mail to user successfully`);
      return sendJSONresponse(res, 200, emailResponse);
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password, token } = req.body;
    const user = await Account.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    }).select('-password');
    if (!user)
      return sendJSONresponse(res, 400, {
        message: 'token time expired',
      });
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiration = undefined;
    user.password = password;
    await user.save();
    logger.info(`password successfully change`);
    return sendJSONresponse(res, 200, {
      message: 'Password Changed',
    });
  } catch (err) {
    logger.error(`password does not change`);
    next(err);
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
        return sendJSONresponse(res, 400, {
          message: `no valid entry found for id`,
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

module.exports = {
  register,
  login,
  logout,
  getAccessTokenForVerifyAccount,
  getAccount,
  accountLoad,
  accountUpdate,
  searchAccount,
  tokenRefresh,
  // tokenRevoke,
  sendEmailForForgetPassword,
  // getAccessTokenForForgetPassword,
  resetPassword,
  changePassword,
};
