const redis = require('redis');
const logger = require('../../config/winston');
const client = redis.createClient();
module.exports.addTokenToBlackList = function(token, tokenExpire) {
  client.SET(`BlackList:${token}`, token, 'PX', tokenExpire);
  logger.info(`access and refresh token add to blacklist`);
};
