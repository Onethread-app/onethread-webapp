const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { sendJSONresponse } = require('../helpers/jsonResponse');

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
    jwt.verify(accessToken, config.jwtSecret, (err, decoded) => {
      if (err) {
        return sendJSONresponse(res, 401, { message: err.message });
      }
      req.user = decoded;
      next();
    });
  } else {
    return sendJSONresponse(res, 401, {
      message: 'No token provided',
    });
  }
};
