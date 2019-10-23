const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const deptCtrl = require('./department.controller.js');
const joiSchema = require('./department.validation');
const SchemaValidator = require('../../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    requireAuth,
    SchemaValidator(joiSchema.create),
    deptCtrl.create,
  )
  .get(requireAuth, deptCtrl.list);

module.exports = router;
