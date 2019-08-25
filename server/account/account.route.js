const express = require('express');
const passportService = require('../services/passport.services');
const passport = require('passport');
const validate = require('express-validation');

const paramValidation = require('./account.validation');

const router = express.Router();


const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });
const accountCtrl = require('./account.controller');
const { permit } = require('../helpers/permission');
const tokenChecker = require('../helpers/tokenChecker');
const schemaValidator = require('../helpers/joiSchemaValidator');

// authentication
router
  .route('/signup')
  .post(schemaValidator(paramValidation.register), accountCtrl.register);
router
  .route('/login')
  .post(schemaValidator(paramValidation.login), requireLogin, accountCtrl.login);

// router
//   .route('/token')
//   .post(accountCtrl.tokenVerification);


router.route('/:accountId').get(tokenChecker, accountCtrl.getAccount);
router
  .route('/logout')
  .get(accountCtrl.logout);
router
  .route('/verify/id/')
  .get(accountCtrl.verifyAccount);

router.route('/change_password').post(accountCtrl.changePassword);

router
  .route('/forget_password')
  .post(accountCtrl.forgetPassword);

// Search for an account
// router
//   .route('/search')
//   .get(requireAuth, permit('user', 'company'), accountCtrl.getAccount)
//   .post(requireAuth, permit('user', 'company'), accountCtrl.searchAccount);

// follow an account
// router
//   .route('/follow')
//   .post(requireAuth, permit('user'), accountCtrl.followAccount);

// // unfollow an account
// router
//   .route('/unfollow')
//   .post(requireAuth, permit('user'), accountCtrl.removeFollowing, accountCtrl.removeFollower);

// friend request
// router
//   .route('/send_request')
//   .post(requireAuth, permit('user'), accountCtrl.sendFriendRequest);
// router
//   .route('/pending_friend')
//   .get(requireAuth, permit('user'), accountCtrl.pendingFriendRequestList);
// router
//   .route('/accept_friend')
//   .post(requireAuth, permit('user'), accountCtrl.acceptFriendRequest);
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

router.param('accountId', accountCtrl.accountLoad);


module.exports = router;
