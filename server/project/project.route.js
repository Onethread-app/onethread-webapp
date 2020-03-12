const express = require('express');
const projectValidation = require('./project.validation');
const router = express.Router();

const schemaValidator = require('../helpers/joiSchemaValidator');
const projectCtrl = require('./project.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
// authentication
router
  .route('/create')
  .post(
    authorization,
    schemaValidator(projectValidation.createNewProjectForCompany),
    projectCtrl.createNewProjectForCompany,
  );
router
  .route('/:compnayId/lists')
  .get(
    authorization,
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.showAllProjectsForCompany,
  );
router
  .route('/change-title')
  .put(
    authorization,
    schemaValidator(projectValidation.changeNameProject),
    projectCtrl.changeTitleProject,
  );
router
  .route('/concern-admin-search/:cname')
  .get(
    authorization,
    schemaValidator(projectValidation.searchConcernAdmin),
    projectCtrl.suggestConcernAdmin,
  );
router
  .route('/:companyId/archive-list')
  .get(
    authorization,
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.archiveProjectList,
  );
router
  .route('/:companyId/pending-requests')
  .get(authorization, projectCtrl.projectPendingRequest);
router
  .route('/accept-request')
  .put(authorization, projectCtrl.acceptProjectRequest);
router
  .route('/reject-request')
  .post(authorization, projectCtrl.rejectProjectRequest);
router
  .route('/:pid')
  .get(authorization, projectCtrl.getProjectDetails);
router
  .route('/:pid/outline')
  .put(
    authorization,
    schemaValidator(projectValidation.updateProjectOutline),
    projectCtrl.updateProjectOutline,
  );

router
  .route('/:pid/description')
  .put(
    authorization,
    schemaValidator(projectValidation.updateProjectDescription),
    projectCtrl.updateProjectDescription,
  );
router
  .route('/:pid/show-files')
  .get(
    authorization,
    schemaValidator(projectValidation.getProject),
    projectCtrl.showAllFilesForProject,
  );
router
  .route('/:pid/archive')
  .put(
    authorization,
    schemaValidator(projectValidation.archiveProject),
    projectCtrl.archiveProject,
  );
module.exports = router;
