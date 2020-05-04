const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('./react.validation');
const reactCtrl = require('./react.controller');
const passport = require('passport');
// const passportService = require('../account/services/passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');
// const accCtrl = require("../../account/save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  .get(requireAuth, permit('user', 'admin'), reactCtrl.listReference)
  .post(
    requireAuth,
    permit('user', 'admin'),
    validate(paramValidation.createSave),
    reactCtrl.create,
  );

router
  .route('/:reactId')
  .get(requireAuth, permit('user', 'admin'), reactCtrl.get)
  .delete(requireAuth, authSelf('react'), reactCtrl.remove); //

router.param('reactId', reactCtrl.load);

module.exports = router;
