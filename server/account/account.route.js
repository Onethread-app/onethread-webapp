"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const router = express.Router();
const jwt = require("express-jwt");
const passportService = require('../../config/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});
const accountCtrl = require("./account.controller");
const {permit, authSelf} = require('../helpers/permission');
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
  .route("/login").post(requireLogin, accountCtrl.login);


// for admin
router
  .route("/admin")
  .post(requireAuth, permit('admin'),accountCtrl.login);
  

  
  
module.exports = router;
