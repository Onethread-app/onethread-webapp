const express = require('express');
const router = express.Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./company.validation');
const companyCtrl = require('./company.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

const memberRoutes = require('./member/member.route');
const deptRoutes = require('./department/department.route');
const designationRoutes = require('./designation/designation.route');

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
  );
// .delete(
//   requireAuth,
//   // SchemaValidator(joiSchema.deleteCompany),
//   companyCtrl.deleteCompany,
// );

// redirect to member
router.use('/:cname/members', memberRoutes);
// redirect to department
router.use('/:cname/departments', deptRoutes);
// redirect to designation
router.use('/:cname/designations', designationRoutes);

router.param('cname', companyCtrl.getCompanyLoad);

module.exports = router;
