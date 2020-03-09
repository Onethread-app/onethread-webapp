const express = require('express');
const projectValidation = require('./project.validation');
const router = express.Router();

const schemaValidator = require('../helpers/joiSchemaValidator');
const projectCtrl = require('./project.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
// const companyCtrl= require('../company/company.controller');
// authentication
router
  .route('/create')
  .post(
    authorization,
    // companyCtrl.authorizeUser('projectCD'),
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
  .route('/concern-admin-search/:companyId')
  .get(
    authorization,
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.suggestConcernAdmin,
  );
router
  .route('/archive-list')
  .get(
    authorization,
    schemaValidator(projectValidation.showProjectList),
    projectCtrl.archiveProjectList,
  );

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
// router.use('/:pid/team-members', memberRoutes);
// router.param(
//    'pid',
//    authorization,
//    // schemaValidator(projectValidation.getProject),
//    projectCtrl.getProjectLoad,
//  );
module.exports = router;
