const jwt = require('jsonwebtoken');
const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../../config/config');
const { sendErrorResponse } = require('../helpers/jsonResponse');
const client = require('../../index.redis');
bluebird.promisifyAll(redis);

module.exports.authorization = async (req, res, next) => {
  let parts =
    req.headers['x-access-token'] ||
    req.headers.authorization;
    if (parts.startsWith('Bearer ')) {
      // Remove Bearer from string
      parts = parts.slice(7, parts.length);
    }
    console.log(parts)
  if (parts) {
    let isBlackListed;
    await client
      .multi()
      .GET(`BlackList:${parts}`)
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
      jwt.verify(parts, config.accessTokenSecret, function(
        err,
        decoded,
      ) {
        if (err) {
          return sendErrorResponse(res, 401, 'AuthError', {
            message: err.message,
          });
        }
        req.user = decoded;
        next();
      });
    }
  } else {
    return sendErrorResponse(res, 401, 'AuthError', {
      message: 'No token provided',
      fieldName: 'headers',
    });
  }
};
