const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Account = require('../account/account.model');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const client = require('../../index.redis');

module.exports.auth = (req, res, next) => {
  let accessToken;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization;
    if (parts) {
      accessToken = parts;
    } else {
      return sendJSONresponse(res, 400, {
        message: 'Bad HTTP authentication header format',
      });
    }
  }
  if (accessToken) {
    jwt.verify(
      accessToken,
      config.jwtSecret,
      async (err, decoded) => {
        if (err) {
          return sendJSONresponse(res, 401, { message: err.message });
        }
        try {
          // decoded from redis by email
          const user = await Account.findOne({ email: decoded.email })
            .select('-password ')
            .populate(
              'companies skillArea jobExperience education profileImage',
              '_id _id name companyName positionName currentlyWork startYear endingYear jobDescription degree institutionName eduDescription startYear endingYear currentlyStudy name link s3Key type',
            );
          if (!user) {
            return sendJSONresponse(res, 404, {
              message: 'user not found',
            });
          }
          req.user = user;
          next();
        } catch (error) {
          next(error);
        }
      },
    );
  } else {
    return sendJSONresponse(res, 401, {
      message: 'No token provided',
    });
  }
};
