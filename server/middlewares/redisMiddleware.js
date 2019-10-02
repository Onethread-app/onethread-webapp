const redis = require('redis');
const config = require('../../config/config');

const client = redis.createClient(
  config.redis.port,
  config.redis.host,
);

module.exports.cacheMiddleware = function(req, res, next) {
  const { username } = req.params;

  client.get(username).exec((err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json({ msg: true, data });
    } else {
      next();
    }
  });
};
