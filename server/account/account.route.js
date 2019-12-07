const express = require('express');
const passport = require('passport');
const passportService = require('../services/passport.services');
const multer = require('multer');
const storage = multer.memoryStorage();
const uploadx = multer({ storage: storage });
const paramValidation = require('./account.validation');

const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', {
  session: false,
});
const accountCtrl = require('./account.controller');
const {
  permit,
  authSelf,
  hasAuthorization,
} = require('../helpers/permission');
//const tokenChecker = require('../helpers/tokenChecker');
const schemaValidator = require('../helpers/joiSchemaValidator');
const tokenChecker = require('../helpers/tokenChecker');
const { cacheMiddleware } = require('../middlewares/redisMiddleware');
const { auth } = require('../middlewares/authorizationMiddleware');
const { sendJSONresponse } = require('../helpers/jsonResponse');
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
    schemaValidator(paramValidation.login),
    requireLogin,
    accountCtrl.login,
  );

// router
//   .route('/token')
//   .post(requireAuth, accountCtrl.tokenVerification);
router.route('/').get(auth, accountCtrl.getAccount);
router.route('/update').put(requireAuth, accountCtrl.accountUpdate);
// router.route('/refresh').post(tokenChecker, accountCtrl.tokenRefresh);
// router.route('/revoke').post(tokenChecker, accountCtrl.tokenRevoke);
router.route('/logout').get(requireAuth, accountCtrl.logout);
router
  .route('/forget-password')
  .post(accountCtrl.sendEmailForForgetPassword);
router
  .route('/forget-password/:token')
  .get(accountCtrl.getAccessTokenForForgetPassword);
router.route('/reset-password').put(accountCtrl.resetPassword);
router
  .route('/change-password')
  .put(requireAuth, accountCtrl.changePassword);
// for admin
router
  .route('/admin')
  .post(requireLogin, permit('admin'), accountCtrl.login);

router.param('account-id', accountCtrl.accountLoad);
// router.use(tokenChecker);

module.exports = router;
