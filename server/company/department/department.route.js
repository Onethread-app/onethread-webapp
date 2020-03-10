const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');
const deptCtrl = require('./department.controller.js');
const companyCtrl = require('../company.controller');
const joiSchema = require('./department.validation');
const SchemaValidator = require('../../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.create),
    deptCtrl.create,
  )
  .get(
    authorization, 
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    deptCtrl.list
    );

module.exports = router;
