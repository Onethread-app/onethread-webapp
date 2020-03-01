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
  .route('/create-project')
  .post(
    authorization,
    schemaValidator(paramValidation.createProject),
    projectCtrl.createNewProject,
  );
router.route('/list-project').get(authorization, projectCtrl.listProjectsFromCompany);
// for admin
// router
//   .route('/admin')
//   .post(requireLogin, permit('admin'), accountCtrl.login);

module.exports = router;
