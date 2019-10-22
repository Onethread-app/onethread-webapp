const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const divisionCtrl = require('./division.controller');

router.route('/').post(requireAuth, divisionCtrl.newDivision);
router.route('/').get(requireAuth, divisionCtrl.divisionList);

module.exports = router;
