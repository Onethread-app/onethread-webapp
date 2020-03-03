const express = require('express');
const paramValidation = require('./project.validation');
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
    schemaValidator(paramValidation.createNewProjectForCompany),
    projectCtrl.createNewProjectForCompany,
  );
router
  .route('/lists')
  .get(authorization, projectCtrl.showAllProjectsForCompany);
router.route('/change-title').put(authorization, projectCtrl.changeTitleProject);
router.param('pid', projectCtrl.getProjectLoad);
router
  .route('/:pid')
  .get(
    authorization,
    schemaValidator(paramValidation.getProject),
    projectCtrl.getProjectDetails,
  );
router
  .route('/:pid/update')
  .put(
    authorization,
    schemaValidator(paramValidation.updateProjectPreface),
    projectCtrl.updateProjectPreface,
  );
router.route('/:pid/delete').delete(authorization, schemaValidator(paramValidation.getProject), projectCtrl.archieveProject);
module.exports = router;
