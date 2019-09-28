const express = require('express');
const passportService = require('../services/passport.services');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const chatkitCtrl = require('./chatkit.controller');

const router = express.Router();

router.route('/:id').get(requireAuth, chatkitCtrl.getUser);

module.exports = router;
