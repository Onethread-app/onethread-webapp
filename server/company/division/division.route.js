const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const divisionCtrl = require('./division.controller');
const joiSchema = require('./division.validation');
const SchemaValidator = require('../../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    requireAuth,
    SchemaValidator(joiSchema.create),
    divisionCtrl.create,
  )
  .get(requireAuth, divisionCtrl.list);

module.exports = router;
