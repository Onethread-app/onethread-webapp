"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./user.validation");
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
  session: false
});
const userCtrl = require('./user.controller');
const {
  permit
} = require('../helpers/permission');

// for individual users
router
  .route("/profile/:id")
  .get(requireAuth, permit('user'), userCtrl.profile);
router
  .route("/profile")
  .post(requireAuth, validate(paramValidation.profile), permit('user'), userCtrl.createProfile);
router
  .route("/profile/:id")
  .put(requireAuth, validate(paramValidation.profile), permit('user'), userCtrl.profileUpdate)
  .delete(requireAuth, permit('user'), userCtrl.profileDelete);

// friend request
router
  .route("/profile/:id/add_friend")
  .post(requireAuth, permit('user'), userCtrl.addFriend);

// router.route("/profile/:id/pending_friend").get(requireAuth, permit('user'), userCtrl.pendingFriendsList);
// router.route("/profile/:id/pending_friend/:id").post(requireAuth, permit('user'), userCtrl.pendingFriendStage);

module.exports = router;