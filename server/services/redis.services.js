const redis = require('redis');
const logger = require('../../config/winston');
const client = redis.createClient();
module.exports.addTokenToBlackList = async (token, tokenExpire) => {
  await client.SET(`BlackList:${token}`, token, 'PX', tokenExpire);
  logger.info(`access and refresh token add to blacklist`);
};
module.exports.accountVerificationToken = async (
  token,
  userID,
  tokenExpire,
) => {
  await client.set(token, JSON.stringify(userID), 'PX', tokenExpire);
  logger.info(`token add into token verification key`);
};
