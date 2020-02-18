const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const httpStatus = require('http-status');
const slug = require('slug');
const Account = require('./account.model');
const config = require('../../config/config');
const logger = require('../../config/winston');
const client = require('../../index.redis');
const {
  sendEmailForVerifyAccount,
  sendEmailForResetPassword,
} = require('../services/email.services');
const { chatkit } = require('../services/pusher.services');
const { addTokenToBlackList } = require('../services/redis.services');
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
      let firstName = slug(data.firstName, {
        replacement: '-',
        symbols: true,
        remove: /[.]/g,
        lower: false,
        charmap: slug.charmap,
        multicharmap: slug.multicharmap,
      });
      let lastName = slug(data.lastName, {
        replacement: '-',
        symbols: true,
        remove: /[.]/g,
        lower: false,
        charmap: slug.charmap,
        multicharmap: slug.multicharmap,
      });
      let uniqueId = result + 1;
      name = firstName + '-' + lastName + '-' + uniqueId;
    });
  let account = new Account({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    name: name,
    contactNo: data.contactNo,
    password: data.password,
    birthDate: data.birthDate,
  });
  const token = crypto.randomBytes(20).toString('hex');
  const verifyToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  account.verifyAccountToken = verifyToken;
  account.verifyAccountTokenExpiration = Date.now() + 604800;
  await account
    .save()
    .then(async user => {
      await chatkit.createUser({
        id: user._id,
        name: user.name,
      });
      sendEmailForVerifyAccount(
        user.firstName,
        user.lastName,
        user.email,
        verifyToken,
      );
      return sendJSONresponse(res, 201, { message: 'User created' });
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
        expiresIn: config.accessTokenExpire,
      },
    );
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
      token: token,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userObj,
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
        '_id name companyName positionName currentlyWork startYear endingYear jobDescription degree institutionName eduDescription startYear endingYear currentlyStudy name link s3Key fileType imageType',
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
    const isUserExist = await Account.findOne({
      verifyAccountToken: token,
    });
    if (!isUserExist)
      return sendJSONresponse(res, 404, {
        isAccountVerified: false,
        message: 'User is not exist',
      });
    const isTimeLimit = await Account.findOne({
      verifyAccountTokenExpiration: { $gt: Date.now() },
    });
    if (!isTimeLimit)
      return sendJSONresponse(res, 400, {
        isAccountVerified: false,
        message: 'Link is expired',
      });
    if (isUserExist && isTimeLimit) {
      await Account.findOneAndUpdate(
        { verifyAccountToken: token },
        {
          $set: {
            verifyAccountToken: undefined,
            isAccountVerified: true,
          },
        },
        { safe: true, upsert: true, new: true },
      );
      return sendJSONresponse(res, 200, {
        isAccountVerified: true,
        message: 'Account Verified Successfully',
      });
    }
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
const logout = async (req, res, next) => {
  try {
    let refreshToken = req.body.refreshToken;
    let accessToken = req.headers.authorization;
    let accessTokenExpire =
      req.user.exp * 1000 +
      new Date(req.user.exp * 1000).getTimezoneOffset() * 60 * 1000 -
      (Date.now() +
        new Date(Date.now()).getTimezoneOffset() * 60 * 1000);
    if (refreshToken) {
      await jwt.verify(
        refreshToken,
        config.refreshTokenSecret,
        (err, user) => {
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
          logger.info('Account successfully Logout');
          return sendJSONresponse(res, 200, {
            success: true,
            message: 'Successfully logout',
          });
        },
      );
    }
  } catch (error) {
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
      return sendErrorResponse(res, 404, '', {
        message: 'no user found',
        fieldName: 'email',
      });
    user.resetPasswordToken = verifyToken;
    user.resetPasswordTokenExpiration = Date.now() + 86400; // 1 day
    user.save();
    sendEmailForResetPassword(
      capitalizeName(user.firstName),
      capitalizeName(user.lastName),
      user.email,
      verifyToken,
    );
    logger.info(`send reset password mail to user successfully`);
    return sendJSONresponse(res, 200);
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
      return sendErrorResponse(res, 401, 'TokenExpireError', {
        message: 'Time is expired',
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
  try {
    const refreshToken = req.body.refreshToken;
    // check if a refresh token exist in blacklist
    let isBlackListed;
    await client
      .multi()
      .GET(`BlackList:${refreshToken}`)
      .execAsync()
      .then(data => {
        // if data object is null token is not blacklisted
        if (data[0] === null) {
          isBlackListed = false;
        } else {
          isBlackListed = true;
        }
      })
      .catch(err => {
        next(err);
      });

    if (isBlackListed) {
      return sendErrorResponse(res, 401, 'AuthError', {
        message: 'invalid token',
      });
    } else {
      await jwt.verify(
        refreshToken,
        config.refreshTokenSecret,
        async function(err, user) {
          if (err) {
            return sendErrorResponse(res, 401, 'AuthError', {
              message: err.message,
            });
          }
          const payLoad = {
            email: user.email,
            _id: user._id,
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
    console.log(err);
    next(err);
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
      return sendErrorResponse(res, 400, 'ValidationError', {
        message: `You can not use the same password`,
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
          return sendErrorResponse(
            res,
            401,
            'PasswordValidationError',
            { message: `Your previous password is wrong` },
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
    const account = await Account.findOne({
      email: email,
    });
    if (!resentType) {
      return sendErrorResponse(res, 400, {
        message: 'Please provide resent-type',
      });
    }
    if (resentType === 'verify-account') {
      account.verifyAccountToken = verifyToken;
      account.verifyAccountTokenExpiration = Date.now() + 604800;
      await sendEmailForVerifyAccount(
        account.firstName,
        account.lastName,
        account.email,
        verifyToken,
      );
    }
    if (resentType === 'reset-password-mail') {
      account.resetPasswordToken = verifyToken;
      account.resetPasswordTokenExpiration = Date.now() + 86400;
      await sendEmailForResetPassword(
        account.name,
        account.email,
        verifyToken,
      );
    }
    await account.save();
    return sendJSONresponse(res, 200, {
      message: 'resend email successfully',
    });
  } catch (error) {
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
