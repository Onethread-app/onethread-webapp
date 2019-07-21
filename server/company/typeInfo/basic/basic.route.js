'use strict';
const express = require('express');
const validate = require('express-validation');
const joiSchema = require('./basic.validation');
const router = express.Router();
const basicCtrl = require('./basic.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit } = require('./../../../helpers/permission');
const SchemaValidator = require('./../../../helpers/joiSchemaValidator');

// for basic information
router
  .route('/')
  .post(
    requireAuth,
    permit('company'),
    SchemaValidator(true, joiSchema.createBasicInfo),
    basicCtrl.createBasicInfo
  );
router
  .route('/:id')
  .get(
    requireAuth,
    permit('company'),
    SchemaValidator(true, joiSchema.getBasicInfo),
    basicCtrl.getBasicInfo
  )
  .put(
    requireAuth,
    permit('company'),
    SchemaValidator(true, joiSchema.updateBasicInfo),
    basicCtrl.updateBasicInfo
  )
  .delete(
    requireAuth,
    permit('company'),
    SchemaValidator(true, joiSchema.deleteBasicInfo),
    basicCtrl.deleteBasicInfo
  );

module.exports = router;
