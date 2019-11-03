const express = require('express');
const validate = require('express-validation');
const passportService = require('../services/passport.services');
const paramValidation = require('./message.validation');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const messageCtrl = require('./message.controller');
const { permit, authSelf } = require('../helpers/permission');

const router = express.Router();

router
  .route('/')
  .post(requireAuth, permit('user', 'admin'), validate(paramValidation.createMessage), messageCtrl.create);

router.route('/:id').get(requireAuth,  messageCtrl.getUser);

module.exports = router;
