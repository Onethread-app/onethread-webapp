const express = require('express');
const projectValidation = require('./project.validation');
const router = express.Router();

const schemaValidator = require('../helpers/joiSchemaValidator');
const projectCtrl = require('./project.controller');
const companyCtrl = require('../company/company.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const subCtrl = require('../subscription/subscription.controller');
const { route } = require('../associate/associate.route');

router
  .route('/change-title')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    schemaValidator(projectValidation.updateProject),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
    ),
    projectCtrl.updateProject,
  );
// authentication
router
  .route('/:companyId/create')
  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(projectValidation.createNewProjectForCompany),
    projectCtrl.createNewProjectForCompany,
  );
router
  .route('/:companyId/create-project')
  .post(
    authorization,
    schemaValidator(projectValidation.createProjectFromHome),
    projectCtrl.createNewProjectFromHome,
  );
router
  .route('/:companyId/add-associates')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    projectCtrl.authorizeProjectRole('all', 'admin'),
    schemaValidator(projectValidation.addAssociate),
    projectCtrl.addAssociateInProject,
  );
router
  .route('/:companyId/lists')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser(
      'all',
      'admin',
      'superAdmin',
      'employee',
    ),
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.showAllProjectsForCompany,
  );

router
  .route('/concern-admin-search/:companyId')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(projectValidation.searchConcernAdmin),
    projectCtrl.suggestConcernAdmin,
  );

router
  .route('/associate-company-search/:companyId')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(projectValidation.searchAssociateCompany),
    projectCtrl.suggestAssociateCompany,
  );
router
  .route('/:companyId/archive-list')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.archiveProjectList,
  );
router
  .route('/:companyId/pending-requests')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(projectValidation.pendingList),
    projectCtrl.projectPendingRequest,
  );
router
  .route('/:companyId/accept-request')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(projectValidation.acceptProject),
    projectCtrl.acceptProjectRequest,
  );
router
  .route('/:companyId/reject-request')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(projectValidation.rejectProject),
    projectCtrl.rejectProjectRequest,
  );
router
  .route('/')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    projectCtrl.getProjectDetails,
  );
router
  .route('/outline')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
    ),
    schemaValidator(projectValidation.updateProjectOutline),
    projectCtrl.updateProjectOutline,
  );

router
  .route('/description')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
    ),
    schemaValidator(projectValidation.updateProjectDescription),
    projectCtrl.updateProjectDescription,
  );
router
  .route('/show-files')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
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
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
    ),
    schemaValidator(projectValidation.archiveProject),
    projectCtrl.archiveProject,
  );
router
  .route('/unarchive')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
    ),
    schemaValidator(projectValidation.unarchiveProject),
    projectCtrl.unarchiveProject,
  );
router
  .route('/:companyId/role')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
    ),
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

router
  .route('/:projectId/tasks')
  .get(authorization, projectCtrl.TasksOfProject);

module.exports = router;
