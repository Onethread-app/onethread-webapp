const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const client = require('../../index.redis');

module.exports.authorization = async (req, res, next) => {
  let accessToken;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization;
    if (parts) {
      accessToken = parts;
    } else {
      return sendErrorResponse(res, 400, {
        message: 'Bad HTTP authentication header format',
      });
    }
  }
  if (accessToken) {
    jwt.verify(
      accessToken,
      config.accessTokenSecret,
      (err, decoded) => {
        if (err) {
          return sendErrorResponse(res, 401, 'AuthError', {
            message: err.message,
            fieldName: 'headers',
          });
        }
        req.user = decoded;
        next();
      },
    );
  } else {
    return sendErrorResponse(res, 401, 'AuthError', {
      message: 'No token provided',
      fieldName: 'headers',
    });
  }
};
