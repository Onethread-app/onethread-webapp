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
  .route('/lists')
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
  .route('/concern-admin-search')
  .get(authorization, schemaValidator(projectValidation.showProjectList), projectCtrl.suggestConcernAdmin);
router
  .route('/archive-list')
  .get(
    authorization,
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.archiveProjectList,
  );
router.param(
  'pid',
  authorization,
  // schemaValidator(projectValidation.getProject),
  projectCtrl.getProjectLoad,
);
router
  .route('/:pid')
  .get(
    authorization,
    projectCtrl.getProjectDetails,
  );
router
  .route('/:pid/update')
  .put(
    authorization,
    schemaValidator(projectValidation.updateProjectPreface),
    projectCtrl.updateProjectPreface,
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
