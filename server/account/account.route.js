const express = require('express');
const passport = require('passport');
const passportService = require('../services/passport.services');
const paramValidation = require('./account.validation');
const { sendErrorResponse } = require('../helpers/jsonResponse');
const httpStatus = require('http-status');

const router = express.Router();

const accountCtrl = require('./account.controller');
const {
  permit,
  authSelf,
  hasAuthorization,
} = require('../helpers/permission');
const schemaValidator = require('../helpers/joiSchemaValidator');
const { auth } = require('../middlewares/authorizationMiddleware');
// authentication
router
  .route('/signup')
  .post(
    schemaValidator(paramValidation.register),
    accountCtrl.register,
  );
router.get(
  '/verify-account/:token',
  accountCtrl.getAccessTokenForVerifyAccount,
);
router.route('/login').post(
  function(req, res, next) {
    passport.authenticate('local', { session: false }, function(
      err,
      user,
      info,
    ) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return sendErrorResponse(res, 401, 'AuthError', {
          message: info.message,
        });
      }
      req.user = user; // Forward user information to the next middleware
      next();
    })(req, res, next);
  },
  schemaValidator(paramValidation.login),
  // requireLogin,
  accountCtrl.login,
);

router.route('/').get(auth, accountCtrl.getAccount);
router
  .route('/update')
  .put(
    auth,
    schemaValidator(paramValidation.update),
    accountCtrl.accountUpdate,
  );
router.route('/logout').get(auth, accountCtrl.logout);
router
  .route('/forget-password')
  .post(accountCtrl.sendEmailForForgetPassword);
router
  .route('/forget-password/:token')
  .get(accountCtrl.getAccessTokenForForgetPassword);
router.route('/reset-password').put(accountCtrl.resetPassword);
router
  .route('/change-password')
  .put(auth, accountCtrl.changePassword);
// for admin
// router
//   .route('/admin')
//   .post(requireLogin, permit('admin'), accountCtrl.login);

router.param('account-id', accountCtrl.accountLoad);

module.exports = router;
