'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./basic.validation');
const basicCtrl = require('./basic.controller');
const { permit } = require('./../../../helpers/permission');
const SchemaValidator = require('./../../../helpers/joiSchemaValidator');

// for basic information
router
  .route('/')
  .post(
    requireAuth,
    permit('company'),
    SchemaValidator(joiSchema.createBasicInfo),
    basicCtrl.createBasicInfo
  );
router
  .route('/:id')
  .get(
    requireAuth,
    permit('company'),
    SchemaValidator(joiSchema.getBasicInfo),
    basicCtrl.getBasicInfo
  )
  .put(
    requireAuth,
    permit('company'),
    SchemaValidator(joiSchema.updateBasicInfo),
    basicCtrl.updateBasicInfo
  )
  .delete(
    requireAuth,
    permit('company'),
    SchemaValidator(joiSchema.deleteBasicInfo),
    basicCtrl.deleteBasicInfo
  );

module.exports = router;
