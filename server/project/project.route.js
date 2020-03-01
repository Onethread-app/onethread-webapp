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
    schemaValidator(paramValidation.createProject),
    projectCtrl.createNewProject,
  );

// for admin
// router
//   .route('/admin')
//   .post(requireLogin, permit('admin'), accountCtrl.login);

module.exports = router;
