const express = require('express');
const {validate,ValidationError} = require('express-validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const paramValidation = require('./review.validation');
const reviewCtrl = require('./review.controller');
const passport = require('passport');
// const passportService = require('../account/services/passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

// const accCtrl = require("../../account/save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')

  .post(
    authorization,
    SchemaValidator(paramValidation.createSave),
    reviewCtrl.create,
  );

module.exports = router;
