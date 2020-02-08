const express = require('express');
const router = express.Router();
const passport = require('passport');

// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./message.validation');
const messageCtrl = require('./message.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    authorization,
    SchemaValidator(joiSchema.create),
    messageCtrl.create,
  );

router
  .route('/room/:roomId')
  .get(
    authorization,
    SchemaValidator(joiSchema.getRoomMessages),
    messageCtrl.getRoomMessages,
  );

module.exports = router;
