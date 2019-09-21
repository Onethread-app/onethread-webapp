'use strict';
const express = require('express');
const router = express.Router();
const passportService = require('../services/passport.services');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
// const tokenChecker = require('../helpers/tokenChecker');
const chatCtrl = require('./chat.controller');
// const { permit } = require('./../helpers/permission');
// const joiSchema = require('./message.validation');
// const SchemaValidator = require('./../helpers/joiSchemaValidator');

// for Messages
// router
//   .route('/all')
//   .get(requireAuth, permit('user'), messageCtrl.getAllMessages);
router
  .route('/auth')
  // .get(requireAuth, permit('user'), messageCtrl.getCurrentAccountMessages)
  .post(chatCtrl.auth);

module.exports = router;
