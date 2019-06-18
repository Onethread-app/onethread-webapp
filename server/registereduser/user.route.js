"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./user.validation");
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const userCtrl = require('./user.controller');
const {permit} = require('../helpers/permission');

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


  
  
module.exports = router;



