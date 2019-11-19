const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const skillCtrl = require('./skillArea.controller');
const paramValidation = require('./skillArea.validation');

const schemaValidator = require('../helpers/joiSchemaValidator');

router
	.route('/')
	.post(
		requireAuth,
		schemaValidator(paramValidation.createSkill),
		skillCtrl.createSkill,
	);

router
	.route('/update-skill')
	.put(
		requireAuth,
		schemaValidator(paramValidation.update),
		skillCtrl.updateUserSkillInfo,
	);
router.route('/').get(requireAuth, skillCtrl.getAllSkill);
router
	.route('/delete-skill')
	.delete(requireAuth, skillCtrl.deleteSkillInfoFromAccount);
router.route('/').get(requireAuth, skillCtrl.getAllSkill);
// router.route('/:id').get(requireAuth, skillCtrl.getSkillInfo);
// router
//   .route('/:id')
//   .put(requireAuth, skillCtrl.updateSkillInfo)
//   .delete(requireAuth, skillCtrl.deleteSkillInfo);
router.route('/search').get(requireAuth, skillCtrl.searchSkillSet);
router.param('id', skillCtrl.skillLoad);

module.exports = router;
