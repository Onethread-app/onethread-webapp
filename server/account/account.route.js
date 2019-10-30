const express = require('express');
const passportService = require('../services/passport.services');
const passport = require('passport');
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
//const skillInfo = require('../skillArea/skillArea.route');
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
router.route('/').get(requireAuth, accountCtrl.getAccount);
router.route('/update').put(
  requireAuth,
  // schemaValidator(paramValidation.update),
  uploadx.single('image'),
  accountCtrl.accountUpdate,
);
router.route('/refresh').post(tokenChecker, accountCtrl.tokenRefresh);
router.route('/revoke').post(tokenChecker, accountCtrl.tokenRevoke);
router.route('/logout').get(requireAuth, accountCtrl.logout);
//router.route('/verifyAccount/:token').get(accountCtrl.verifyAccount);

// router.route('/forgetPassword').post(accountCtrl.forgetPassword);
// router
//   .route('/forgetPassword/:token')
//   .get(accountCtrl.verifyChangePassword);

router
  .route('/forget-password')
  .post(accountCtrl.sendEmailForForgetPassword);
router
  .route('/forget-password/:token')
  .get(accountCtrl.getAccessTokenForForgetPassword);
router.route('/reset-password').put(accountCtrl.resetPassword);

// router.route('/changePassword').post(accountCtrl.changePassword);

// Search for an account
// router.route('/search').get(
//   //schemaValidator(paramValidation.search),
//   requireAuth,
//   accountCtrl.searchAccount,
// );

// follow an account
// router
//   .route('/follow')
//   .post(requireAuth, permit('user'), accountCtrl.followAccount);

// // unfollow an account
// router
//   .route('/unfollow')
//   .post(requireAuth, permit('user'), accountCtrl.removeFollowing, accountCtrl.removeFollower);

// friend request
router
  .route('/sendfriendRequest')
  .post(requireAuth, accountCtrl.sendFriendRequest);
router
  .route('/:accountId/pendingFriend')
  .get(accountCtrl.pendingFriendRequestList);
router
  .route('/accept_friend')
  .post(requireAuth, permit('user'), accountCtrl.acceptFriendRequest);

router
  .route('/:accountId/friendList')
  .get(requireAuth, accountCtrl.friendList);

router
  .route('/:accountId/sendingFriendRequestList')
  .get(requireAuth, accountCtrl.sendFriendRequestList);
// router
//   .route('/reject_friend')
//   .post(requireAuth, permit('user'), accountCtrl.rejectFriendRequest);
// router
//   .route('/unfriend_request')
//   .post(requireAuth, permit('user'), accountCtrl.removeFriend);

// for admin
router
  .route('/admin')
  .post(requireLogin, permit('admin'), accountCtrl.login);

router.param('account-id', accountCtrl.accountLoad);
// router.use(tokenChecker);

module.exports = router;
