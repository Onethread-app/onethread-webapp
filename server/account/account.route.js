"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./account.validation");
const router = express.Router();
const passportService = require('../../config/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});
const accountCtrl = require('./account.controller');
const {permit} = require('../helpers/permission');
// authentication
router  
  .route('/signup')
  .post(validate(paramValidation.register),accountCtrl.register);
router
  .route("/login")
  .post(requireLogin, accountCtrl.login);
router
  .route("/logout")
  .get(requireAuth, accountCtrl.logout);
router
  .route('/change_password')
  .post( accountCtrl.changePassword);

// send confirmation mail after sign up
router
  .route('/send')
  .get(accountCtrl.confirmationMail);
// verfiy user if he check his email
router
  .route('/verify')
  .get(accountCtrl.verifyAccount);

// router
//   .route('/forget_password')
//   .post( accountCtrl.forgetPassword);

// Search for an account
router
  .route('/search')
  .get(requireAuth, permit('user','company'), accountCtrl.getAllAccounts)
  .post(requireAuth, permit('user', 'company'), accountCtrl.searchAccount);

// follow an account
router
  .route('/follow')
  .post(requireAuth, permit('user'), accountCtrl.followAccount);

// unfollow an account
router
  .route('/unfollow')
  .post(requireAuth, permit('user'), accountCtrl.removeFollowing, accountCtrl.removeFollower);

// friend request
router
  .route('/send_request')
  .post(requireAuth, permit('user'), accountCtrl.sendFriendRequest);
router
  .route("/:id/add_friend")
  .post(requireAuth, permit('user'), accountCtrl.addFriendRequest);
router
  .route("/pending_friend")
  .get(requireAuth, permit('user'), accountCtrl.pendingFriendRequestList);


// for admin
router
  .route("/admin")
  .post(requireAuth, permit('admin'),accountCtrl.login);
  
  
module.exports = router;
