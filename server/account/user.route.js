"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const router = express.Router();
const jwt = require("express-jwt");
const passportService = require('./services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});
const accountCtrl = require("./controller/account.controller");
const userCtrl = require("./controller/user.controller");
const auth = require('./auth');
const permit = require('./permission');
// authentication
router  
  .route('/signup')
  .post(accountCtrl.register);

router
  .route('/change_password')
  .post( accountCtrl.changePassword);

router
  .route('/send')
  .get(accountCtrl.confirmationMail);

router
  .route('/verify')
  .get(accountCtrl.verifyAccount);

//router
//  .route('/forget_password')
//  .post( accountCtrl.forgetPassword);

router
  .route("/login")
  .post(accountCtrl.login);

// for admin
router
  .route("/profile")
  .get(requireAuth, permit('admin'), accountCtrl.profileList);

// for individual users
router
  .route("/profile/:id")
  .post(requireAuth, permit('user'), userCtrl.createProfile)
  .get(requireAuth, permit('user'), userCtrl.profile);
router
  .route("/profile/:id")

  .put(requireAuth, permit('user'), accountCtrl.profileUpdate)
  .delete(requireAuth, permit('user'), accountCtrl.profileDelete);

// for company users
router
  .route("/profile/:id")
  .get(requireAuth, permit('company'), accountCtrl.profile)
  .put(requireAuth, permit('company'), accountCtrl.profileUpdate)
  .delete(requireAuth, permit('company'), accountCtrl.profileDelete)

// for all registered account

  
  
module.exports = router;
