const express = require('express');
const router = express.Router();
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const teamValidation = require('./team.validation');
const teamCtrl = require('./team.controller');
const projectCtrl = require('../project/project.controller');
const SchemaValidator = require('../helpers/joiSchemaValidator');

router
  .route('/:companyId/search')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    teamCtrl.searchTeamMember,
  );

router.route('/:companyId/add-team-member').post(
  authorization,
  // TODO: member validations
  projectCtrl.authorizeProjectRole(
    'all',
    'admin',
    'projectModerator',
    'member',
  ),
  // SchemaValidator(joiSchema.newMember),
  teamCtrl.addTeamMember,
);
// .get(authorization, teamCtrl.list);
router.route('/member-list').get(authorization, teamCtrl.list);
router.route('/:memberId').get(
  authorization,
  // SchemaValidator(teamValidation.getMember),
  teamCtrl.getMember,
);

router.route('/:memberId/changeRole').put(
  authorization,
  projectCtrl.authorizeProjectRole(
    'all',
    'admin',
    'projectModerator',
  ),
  // SchemaValidator(teamValidation.changeRole),
  teamCtrl.changeRole,
);
router.param('memberId', teamCtrl.getMemberLoad);

module.exports = router;
