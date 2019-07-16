'use strict';
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./basic.validation');
const router = express.Router();
const basicCtrl = require('./basic.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('./../../../helpers/permission');

// for basic information
router
  .route('/')
  .post(requireAuth, permit('company'), basicCtrl.createBasicProfile);
// router
//   .route('/:id')
//   .get(
//     requireAuth,
//     permit('company'),
//     validate(paramValidation.getCompany),
//     basicCtrl.getCompanyProfile
//   )
//   .put(
//     requireAuth,
//     permit('company'),
//     validate(paramValidation.updateCompany),
//     basicCtrl.updateCompanyProfile
//   )
//   .delete(
//     requireAuth,
//     permit('company'),
//     validate(paramValidation.deleteCompany),
//     basicCtrl.deleteCompanyProfile
//   );

module.exports = router;
