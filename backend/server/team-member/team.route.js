const express = require('express');
const router = express.Router();
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const teamValidation = require('./team.validation');
const teamCtrl = require('./team.controller');
const {
  authorizeProjectRole,
} = require('../middlewares/projectRoleMiddleware');
const SchemaValidator = require('../helpers/joiSchemaValidator');
const subCtrl = require('../middlewares/subscriptionCheckerMiddleware');
router
  .route('/:companyId/search')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    teamCtrl.searchTeamMember,
  );

router.route('/:companyId/add-team-member').post(
  authorization,
  subCtrl.subscriptionExpireCheck(),
  // TODO: member validations
  authorizeProjectRole('all', 'admin', 'projectModerator', 'member'),
  // SchemaValidator(joiSchema.newMember),

  teamCtrl.addTeamMember,
);
// .get(authorization, teamCtrl.list);
router
  .route('/member-list')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole(
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
    authorizeProjectRole(
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
    authorizeProjectRole('all', 'admin', 'projectModerator'),
    subCtrl.subscriptionExpireCheck(),
    SchemaValidator(teamValidation.changeRole),
    teamCtrl.changeRole,
  );
router.param('memberId', teamCtrl.getMemberLoad);

module.exports = router;
