const express = require('express');
const {validate} = require('express-validation');
const passport = require('passport');
const paramValidation = require('./report.validation');
const reportCtrl = require('./report.controller');

const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');

const router = express.Router(); // eslint-disable-line new-cap

router
	.route('/')
	.get(requireAuth, permit('user', 'admin'), reportCtrl.list) // this may not needed
	.post(
		requireAuth,
		permit('user', 'admin'),
		validate(paramValidation.createSave),
		reportCtrl.create,
	);
router
	.route('/block/:reportId')
	.post(requireAuth, permit('admin'), reportCtrl.review);
router
	.route('/:reportId')
	.get(requireAuth, permit('admin'), reportCtrl.get)
	.delete(requireAuth, authSelf('report'), reportCtrl.remove);

router.param('reportId', reportCtrl.load);

module.exports = router;
