const express = require('express');
const router = express.Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./message.validation');
const messageCtrl = require('./message.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    requireAuth,
    SchemaValidator(joiSchema.create),
    messageCtrl.create,
  );

router
  .route('/room/:roomId')
  .get(
    requireAuth,
    SchemaValidator(joiSchema.getRoomMessages),
    messageCtrl.getRoomMessages,
  );

module.exports = router;
