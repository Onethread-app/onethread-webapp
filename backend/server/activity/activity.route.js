const express = require('express');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit } = require('../helpers/permission');
const activityCtrl = require('./activity.controller');

const router = express.Router();

router
  .route('/:model/:recordId')
  .get(requireAuth, permit('user', 'admin'), activityCtrl.list);

module.exports = router;
