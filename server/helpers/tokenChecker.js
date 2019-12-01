const jwt = require('jsonwebtoken');
const { sendJSONresponse } = require('./jsonResponse');
const config = require('../../config/config');
const client = require('../../index.redis');
const Account = require('../account/account.model');
module.exports = async (req, res, next) => {
  //   try {
  //     // const bearerHeader = req.headers.authorization;
  //     // if (typeof bearerHeader !== 'undefined') {
  //     //   const accessToken = bearerHeader.split(' ')[1];
  //     //   try {
  //     //     client.GET(accessToken, async (err1, refreshToken) => {
  //     //       try {
  //     //         const accessTokenValidation = await jwt.verify(
  //     //           refreshToken,
  //     //           config.jwtRefreshExpire,
  //     //         );
  //     //         console.log(refreshTokenValidation.id);
  //     //         client.GET(
  //     //           `data:${refreshTokenValidation.id}`,
  //     //           async (err2, newlyUpdatedRefreshToken) => {
  //     //             const new_accessToken = await jwt.sign(
  //     //               {
  //     //                 id: refreshTokenValidation.id,
  //     //                 username: refreshTokenValidation.username,
  //     //               },
  //     //               config.jwtSecretKey,
  //     //               { expiresIn: '15m' },
  //     //             );
  //     //             client.SET(
  //     //               new_accessToken,
  //     //               newlyUpdatedRefreshToken,
  //     //               (err11, rep11) => {
  //     //                 client.DEL(accessToken, (err22, rep22) => {
  //     //                   validAccessToken = new_accessToken;
  //     //                   return res.status(403).json({
  //     //                     message:
  //     //                       'please add this new token to the header.',
  //     //                     token: new_accessToken,
  //     //                   });
  //     //                 });
  //     //               },
  //     //             );
  //     //           },
  //     //         );
  //     //       } catch (err3) {
  //     //         client.DEL(refreshToken);
  //     //         res
  //     //           .status(401)
  //     //           .json({ message: 'You have to sign in Now!' });
  //     //       }
  //     //     });
  //     const accessTokenValidation = await jwt.verify(
  //       accessToken,
  //       config.jwtSecret,
  //     );
  //     const user = await Account.findOne({
  //       _id: accessTokenValidation.email._id,
  //     });

  //     // console.log(user);
  //     if (!user)
  //       return res.status(404).json({ message: 'User not found' });
  //     if (user && user.isAccountActive === false)
  //       return res
  //         .status(404)
  //         .json({ message: 'Active User not found' });
  //     req.token = accessToken;
  //     req.user = user;
  //     next();
  //   } catch (err0) {
  //     client.GET(accessToken, async (err1, refreshToken) => {
  //       try {
  //         const refreshTokenValidation = await jwt.verify(
  //           refreshToken,
  //           config.jwtSecretKey,
  //         );
  //         client.GET(
  //           `userID:${refreshTokenValidation.id}`,
  //           async (err2, newlyUpdatedRefreshToken) => {
  //             const new_accessToken = await jwt.sign(
  //               {
  //                 id: refreshTokenValidation.id,
  //                 username: refreshTokenValidation.username,
  //               },
  //               config.jwtSecretKey,
  //               { expiresIn: '15m' },
  //             );
  //             client.SET(
  //               new_accessToken,
  //               newlyUpdatedRefreshToken,
  //               (err11, rep11) => {
  //                 client.DEL(accessToken, (err22, rep22) => {
  //                   validAccessToken = new_accessToken;
  //                   return res.status(403).json({
  //                     message:
  //                       'please add this new token to the header.',
  //                     token: new_accessToken,
  //                   });
  //                 });
  //               },
  //             );
  //           },
  //         );
  //       } catch (err3) {
  //         client.DEL(refreshToken);
  //         res.status(401).json({ message: 'You have to sign in Now!' });
  //       }
  //     });
  //   }
  //   // } else {
  //   //   res.status(403).json({
  //   //     message: 'You are not allowed to access this page!',
  //   //   });
  // };
  // // } catch (err) {
  // //   console.log(err);
  // //   next(err);

  let accessToken;
  let hasMultiplePlaces = false;

  // const QUERY_AUTHORIZACION_KEY = 'accessToken';
  const bodyAuthorizationKey = 'accessToken';
  const headerAuthorizationKey = 'Bearer';

  // if (req.query && req.query[QUERY_AUTHORIZATION_KEY]) {
  //     accessToken = req.query[QUERY_AUTHORIZATION_KEY];
  // }

  if (req.body && req.body[bodyAuthorizationKey]) {
    if (accessToken) {
      hasMultiplePlaces = true;
    }
    accessToken = req.body[bodyAuthorizationKey];
  }
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === headerAuthorizationKey) {
      if (accessToken) {
        hasMultiplePlaces = true;
      }
      accessToken = parts[1];
    } else {
      return sendJSONresponse(res, 400, {
        message: 'Bad HTTP Authentication Header',
      });
    }
  }

  if (hasMultiplePlaces) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message:
        'RFC6750 states the accessToken MUST NOT be provided in more than one place in a single request',
    });
  } else {
    if (accessToken) {
      // 1st step: try accessToken key exist in cache server
      // 2nd step: if exist set accessToken value into req.user
      // 3rd step: if not exist in cache server catch it,
      // 4th step: decode it from req.user
      jwt.verify(accessToken, config.accessTokenSecret, function(
        err,
        decoded,
      ) {
        if (err) {
          return res.status(401).json({
            statusCode: 401,
            error: 'Unauthorized',
            message: err.message,
          });
        }
        console.log(req);
        req.user.email = decoded;

        next();
      });
    }
  }
};
// }
