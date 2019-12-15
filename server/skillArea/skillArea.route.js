const express = require('express');
const router = express.Router();
const passport = require('passport');
const { auth } = require('../middlewares/authorizationMiddleware');
const skillCtrl = require('./skillArea.controller');
const paramValidation = require('./skillArea.validation');
const schemaValidator = require('../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    auth,
    schemaValidator(paramValidation.create),
    skillCtrl.createSkill,
  );

router
  .route('/update-skill')
  .put(auth, skillCtrl.updateUserSkillInfo);
router.route('/').get(auth, skillCtrl.getAllSkill);
router
  .route('/delete-skill')
  .delete(auth, skillCtrl.deleteSkillInfoFromAccount);
router.route('/').get(auth, skillCtrl.getAllSkill);
router.route('/search').get(auth, skillCtrl.searchSkillSet);
router.param('id', skillCtrl.skillLoad);

module.exports = router;
