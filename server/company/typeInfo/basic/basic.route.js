'use strict';
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./basic.validation');
const router = express.Router();
const basicCtrl = require('./basic.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit } = require('./../../../helpers/permission');

// for basic information
router
  .route('/')
  .post(requireAuth, permit('company'), basicCtrl.createBasicInfo);
router
  .route('/:id')
  .get(
    requireAuth,
    permit('company'),
    validate(paramValidation.getBasicInfo),
    basicCtrl.getBasicInfo
  )
  .put(requireAuth, permit('company'), basicCtrl.updateBasicInfo)
  .delete(
    requireAuth,
    permit('company'),
    validate(paramValidation.deleteBasicInfo),
    basicCtrl.deleteBasicInfo
  );

module.exports = router;
