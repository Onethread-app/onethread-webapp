const express = require('express');
const projectValidation = require('./project.validation');
const router = express.Router();

const schemaValidator = require('../helpers/joiSchemaValidator');
const projectCtrl = require('./project.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const {
  authorizeProjectRole,
} = require('../middlewares/projectRoleMiddleware');
const subCtrl = require('../middlewares/subscriptionCheckerMiddleware');

router
  .route('/lists')
  .get(authorization, projectCtrl.getAllProjectForUser);

router
  .route('/favourite')
  .put(
    authorization,
    projectCtrl.favouriteProject,
    schemaValidator(projectValidation.favouriteProject),
  );

router
  .route('/favourite-list')
  .get(authorization, projectCtrl.getAllFavouriteProjects);

router
  .route('/change-title')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.updateProject),
    authorizeProjectRole('all', 'admin', 'projectModerator'),
    projectCtrl.updateProject,
  );
router
  .route('/create-project')
  .post(
    authorization,
    schemaValidator(projectValidation.createProjectFromHome),
    projectCtrl.createNewProjectFromHome,
  );

router.route('/company-lists').get(
  authorization,
  subCtrl.subscriptionExpireCheck(),
  // schemaValidator(projectValidation.showProjectList),
  projectCtrl.showAllProjectsForCompany,
);

router
  .route('/:companyId/add-associates')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.addAssociate),
    projectCtrl.addAssociateInProject,
  );

router
  .route('/concern-admin-search/:companyId')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.searchConcernAdmin),
    projectCtrl.suggestConcernAdmin,
  );

router
  .route('/associate-company-search/:companyId')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.searchAssociateCompany),
    projectCtrl.suggestAssociateCompany,
  );
router
  .route('/:companyId/archive-list')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.archiveProjectList,
  );
router
  .route('/:companyId/pending-requests')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.pendingList),
    projectCtrl.projectPendingRequest,
  );
router
  .route('/:companyId/accept-request')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.acceptProject),
    projectCtrl.acceptProjectRequest,
  );
router
  .route('/:companyId/reject-request')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.rejectProject),
    projectCtrl.rejectProjectRequest,
  );
router
  .route('/')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    projectCtrl.getProjectDetails,
  )
  .delete(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole('all', 'admin', 'projectModerator'),
    projectCtrl.deleteProject,
  );

router
  .route('/outline')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole('all', 'admin', 'projectModerator'),
    schemaValidator(projectValidation.updateProjectOutline),
    projectCtrl.updateProjectOutline,
  );

router
  .route('/description')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole('all', 'admin', 'projectModerator'),
    schemaValidator(projectValidation.updateProjectDescription),
    projectCtrl.updateProjectDescription,
  );
router
  .route('/show-files')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    schemaValidator(projectValidation.getProject),
    projectCtrl.showAllFilesForProject,
  );
router
  .route('/archive')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.archiveProject),
    projectCtrl.archiveProject,
  );
router
  .route('/unarchive')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.unarchiveProject),
    projectCtrl.unarchiveProject,
  );
router
  .route('/:companyId/role')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    authorizeProjectRole('all', 'admin', 'projectModerator'),
    projectCtrl.updateRole,
  );
router
  .route('/individual/:account')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.getProjectIndividual,
  );
router
  .route('/project-list/:memberId')
  .get(authorization, projectCtrl.projectListForMember);

//TODOS: need to add permission, subscriptioncheck, validation
router
  .route('/overview')
  .get(authorization, projectCtrl.projectOverview);

router
  .route('/list/overview')
  .get(authorization, projectCtrl.getListOverview);

router
  .route('/tasks')
  .get(
    authorization,
    schemaValidator(projectValidation.getTasks),
    projectCtrl.getTasks,
  );

router
  .route('/:projectId/teams/:accountId')
  .delete(
    authorization,
    schemaValidator(projectValidation.deleteTeamMember),
    projectCtrl.deleteTeamMember,
  );

module.exports = router;
