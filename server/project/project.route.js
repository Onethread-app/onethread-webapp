const express = require('express');
const router = express.Router();
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const companyCtrl= require('../company/company.controller');
const joiSchema = require('./project.validation');
const SchemaValidator = require('../helpers/joiSchemaValidator');

const projectCtrl = require('./project.controller');

// create project
router
  .route('/:cname')
  .post(
    authorization, 
    companyCtrl.authorizeAdmin('projectCD'),
    SchemaValidator(joiSchema.create),
    projectCtrl.create,
  );

  router.param('cname', companyCtrl.getCompanyLoad);

module.exports = router;
