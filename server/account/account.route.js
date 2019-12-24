const express = require('express');
const passportService = require('../services/passport.services');
const paramValidation = require('./account.validation');
const router = express.Router();

const accountCtrl = require('./account.controller');
const {
  permit,
  authSelf,
  hasAuthorization,
} = require('../helpers/permission');
const schemaValidator = require('../helpers/joiSchemaValidator');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const {
  authentication,
} = require('../middlewares/authenticationMiddleware');
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
router
  .route('/login')
  .post(
    authentication,
    schemaValidator(paramValidation.login),
    accountCtrl.login,
  );

router.route('/').get(authorization, accountCtrl.getAccount);
router
  .route('/update')
  .put(
    authorization,
    schemaValidator(paramValidation.update),
    accountCtrl.accountUpdate,
  );
router.route('/logout').get(authorization, accountCtrl.logout);
router
  .route('/forget-password')
  .post(accountCtrl.sendEmailForForgetPassword);
router
  .route('/forget-password/:token')
  .get(accountCtrl.getAccessTokenForForgetPassword);
router
  .route('/reset-password')
  .put(
    schemaValidator(paramValidation.resetPassword),
    accountCtrl.resetPassword,
  );
router
  .route('/change-password')
  .put(authorization, accountCtrl.changePassword);
// for admin
// router
//   .route('/admin')
//   .post(requireLogin, permit('admin'), accountCtrl.login);

router.param('account-id', accountCtrl.accountLoad);

module.exports = router;
