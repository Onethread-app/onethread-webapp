"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const router = express.Router();
const jwt = require("express-jwt");
const accountCtrl = require("./controller/user.controller");
const auth = require('./auth');
// authentication
router  
  .route('/signup')
  .post(validate(paramValidation.register), accountCtrl.register);
// router 
//   .route('/')
//   .get(accountCtrl.accountCtrlList);
router
  .route("/login")
  .post(accountCtrl.login);

// user delete
//  router
//    .route("/logout")
//    .post(accountCtrl.logout);

//setup a profile
//  router
//    .route("/profile", auth)
//    .get(accountCtrl.profileList);
// setup a user profile
router
  .route("/profile") // get the list of all profile
  .get(accountCtrl.profileList);
// get particular profile by using their id 
router
  .route("/profile/:id")
  .get(accountCtrl.profile)
  .put(accountCtrl.profileUpdate)
  .delete(accountCtrl.profileDelete);

module.exports = router;
