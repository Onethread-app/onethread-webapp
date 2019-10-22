const express = require('express');
const router = express.Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./company.validation');
const companyCtrl = require('./company.controller');
const { permit } = require('./../helpers/permission');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

const memberRoutes = require('./member/member.route');
const deptRoutes = require('./department/department.route');
const divisionRoutes = require('./division/division.route');

// for company profile
router
  .route('/')
  .post(
    requireAuth,
    SchemaValidator(joiSchema.newCompany),
    companyCtrl.createCompany,
  );

router
  .route('/:cname')
  .get(
    requireAuth,
    SchemaValidator(joiSchema.getCompany),
    companyCtrl.getCompany,
  )
  .put(
    requireAuth,
    SchemaValidator(joiSchema.updateCompany),
    companyCtrl.updateCompany,
  )
  .delete(
    requireAuth,
    // SchemaValidator(joiSchema.deleteCompany),
    companyCtrl.deleteCompany,
  );

router.route('/:cname/employees').put(
  requireAuth,
  // SchemaValidator(joiSchema.getCompany),
  companyCtrl.addEmployees,
);

// redirect to member
router.use('/:cname/members', memberRoutes);
router.use('/:cname/department', deptRoutes);
router.use('/:cname/division', divisionRoutes);

router.param('cname', companyCtrl.getCompanyLoad);

module.exports = router;
