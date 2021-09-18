const express = require('express');

const router = express.Router();
const { authorization } = require('../middlewares/authorizationMiddleware');
const teamValidation = require('./team.validation');
const teamCtrl = require('./team.controller');
const projectCtrl = require('../project/project.controller');
const SchemaValidator = require('../helpers/joiSchemaValidator');
const subCtrl = require('../subscription/subscription.controller');

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
    subCtrl.subscriptionExpireCheck(),
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
  subCtrl.subscriptionExpireCheck(),
  teamCtrl.addTeamMember,
);
// .get(authorization, teamCtrl.list);
router
  .route('/member-list')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    teamCtrl.list,
  );

router
  .route('/associate-list')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    teamCtrl.associateListInProject,
  );

router.route('/:memberId').get(
  authorization,
  // SchemaValidator(teamValidation.getMember),
  subCtrl.subscriptionExpireCheck(),
  teamCtrl.getMember,
);

router
  .route('/:memberId/change-role')
  .put(
    authorization,
    projectCtrl.authorizeProjectRole('all', 'admin', 'projectModerator'),
    subCtrl.subscriptionExpireCheck(),
    SchemaValidator(teamValidation.changeRole),
    teamCtrl.changeRole,
  );
router.param('memberId', teamCtrl.getMemberLoad);

module.exports = router;
