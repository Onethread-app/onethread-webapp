const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const designationCtrl = require('./designation.controller');
const joiSchema = require('./designation.validation');
const SchemaValidator = require('../../helpers/joiSchemaValidator');

router
  .route('/:memberId')
  .post(
    requireAuth,
    SchemaValidator(joiSchema.create),
    designationCtrl.create,
  )
  .get(
    requireAuth,
    SchemaValidator(joiSchema.get),
    designationCtrl.list,
  );

router.param('memberId', designationCtrl.load);

module.exports = router;
