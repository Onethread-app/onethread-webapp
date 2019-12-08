/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Account = require('../../server/account/account.model');
const redisClient = require('../../index.redis');

module.exports.verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const access_token = bearerHeader.split(' ')[1];
      try {
        const accessTokenValidation = await jwt.verify(
          access_token,
          config.accessTokenSecret,
        );
        const user = await Account.findOne({
          _id: accessTokenValidation.email,
        });
        if (!user)
          return res.status(404).json({ message: 'User not found' });
        if (user && user.isAccountActive === false)
          return res
            .status(404)
            .json({ message: 'Active User not found' });
        req.token = access_token;
        req.user = user;
        next();
      } catch (err0) {
        redisClient.GET(access_token, async (err1, refresh_token) => {
          try {
            console.log('yes');
            const refreshTokenValidation = await jwt.verify(
              refresh_token,
              config.refreshTokenSecret,
            );

            console.log(refreshTokenValidation);
            redisClient.GET(
              `userID:${refreshTokenValidation.id}`,
              async (err2, newlyUpdatedRefreshToken) => {
                const new_access_token = await jwt.sign(
                  {
                    id: refreshTokenValidation.id,
                    username: refreshTokenValidation.username,
                  },
                  config.jwtSecret,
                  { expiresIn: '15m' },
                );
                redisClient.SET(
                  new_access_token,
                  newlyUpdatedRefreshToken,
                  (err11, rep11) => {
                    redisClient.DEL(access_token, (err22, rep22) => {
                      validAccessToken = new_access_token;
                      return res.status(403).json({
                        message:
                          'please add this new token to the header.',
                        token: new_access_token,
                      });
                    });
                  },
                );
              },
            );
          } catch (err3) {
            redisClient.DEL(refresh_token);
            res
              .status(401)
              .json({ message: 'You have to sign in Now!' });
          }
        });
      }
    } else {
      res.status(403).json({
        message: 'You are not allowed to access this page!',
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
