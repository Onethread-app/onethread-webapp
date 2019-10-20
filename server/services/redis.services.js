const redis = require('redis');
const logger = require('../../config/winston');
const client = redis.createClient();
module.exports.addRefreshTokenToList = async (
  refreshToken,
  data,
  accessToken,
  exp,
) => {
  data = data.toString();
  client.HMSET(
    refreshToken,
    {
      data,
      accessToken,
    },
    (err, replies) => {
      if (err) {
        logger.debug(`redis error while save in database ${err}`);
      } else {
        logger.info(`successfully set to ${data} data`);
        return replies;
      }
    },
  );
  client.expire(refreshToken, exp);
};

module.exports.updateRefreshTokenfromList = function(
  refreshToken,
  accessToken,
) {
  client.hset(refreshToken, 'accessToken', accessToken, redis.print);
  logger.info(`successfully update refresh token for the user`);
};

module.exports.removeRefreshTokenfromList = function(refreshToken) {
  client.del(refreshToken, redis.print);
  logger.info(`remove refresh token for the user`);
};
