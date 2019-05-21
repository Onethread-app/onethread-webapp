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
// router 
//   .route('/')
//   .get(accountCtrl.accountCtrlList);
router
  .route("/login")
  .post(accountCtrl.login);

  // setup a profile


// user delete
//  router
//    .route("/logout")
//    .post(accountCtrl.logout);

//setup a profile
//  router
//    .route("/profile", auth)
//    .get(accountCtrl.profileList);
// setup a user profile
// router
//   .route("/profile") // get the list of all profile
//   .get(accountCtrl.profileList);
// get particular profile by using their id 

// for admin
router
  .route("/profile")
  .get(accountCtrl.profileList);

// for individual users
router
  .route("/profile")
  .post(requireAuth, permit('user'), userCtrl.createProfile);

router
  .route("/profile/:id")
  .get(requireAuth, permit('user'), accountCtrl.profile)
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
