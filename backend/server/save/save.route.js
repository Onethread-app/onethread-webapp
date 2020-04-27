'use strict';

const express = require('express');
const {validate} = require('express-validation');
const passport = require('passport');
const paramValidation = require('./save.validation');
const saveCtrl = require('./save.controller');
// const passportService = require('../account/services/passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');
// const accCtrl = require("../../account/save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  .get(requireAuth, permit('user', 'admin'), saveCtrl.list)
  .post(
    requireAuth,
    permit('user', 'admin'),
    validate(paramValidation.createSave),
    saveCtrl.create,
  );

router
  .route('/:saveId')
  .get(requireAuth, permit('user', 'admin'), saveCtrl.get)
  .delete(requireAuth, authSelf('save'), saveCtrl.remove); //

router.param('saveId', saveCtrl.load);

module.exports = router;
