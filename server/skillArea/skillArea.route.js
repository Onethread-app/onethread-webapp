const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const skillCtrl = require('./skillArea.controller');
const paramValidation = require('./skillArea.validation');
const schemaValidator = require('../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    authorization,
    schemaValidator(paramValidation.create),
    skillCtrl.createSkill,
  );

router
  .route('/update-skill')
  .put(authorization, skillCtrl.updateUserSkillInfo);
router.route('/').get(authorization, skillCtrl.getAllSkill);
router
  .route('/delete-skill')
  .delete(authorization, skillCtrl.deleteSkillInfoFromAccount);
router.route('/').get(authorization, skillCtrl.getAllSkill);
router.route('/search').get(authorization, skillCtrl.searchSkillSet);
router.param('id', skillCtrl.skillLoad);

module.exports = router;
