"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const router = express.Router();
const jwt = require("express-jwt");
const passportService = require('../../config/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const companyCtrl = require("./company.controller");
const {permit, authSelf} = require('../helpers/permission');


// for company users
router
  .route("/:id")
  .post(requireAuth, permit('company'), companyCtrl.createProfile)
  .get(requireAuth, permit('company'), companyCtrl.profile)
  .put(requireAuth, permit('company'), companyCtrl.profileUpdate)
  .delete(requireAuth, permit('company'), companyCtrl.profileDelete);

// for all registered account

  
  
module.exports = router;
