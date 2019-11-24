const redis = require('redis');
const client = require('../../index.redis');
const cacheMiddleware = function(req, res, next) {
  const token = req.token;
  next();
  // client.hgetall(token, (err, user) => {
  //   if (err) {
  //     return res.json({
  //       status: 400,
  //       message: 'Something went wrong',
  //       err,
  //     });
  //   }
  //   console.log(user);
  //   if (!user) {
  //     return res.json({
  //       status: 400,
  //       message: 'Could not find that user',
  //     });
  //   }
  //   next();
  // });
};

module.exports = { cacheMiddleware };
