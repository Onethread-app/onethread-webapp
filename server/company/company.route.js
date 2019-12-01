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

// create company
router
  .route('/')
  .post(
    requireAuth,
    SchemaValidator(joiSchema.newCompany),
    companyCtrl.createCompany,
  );

// get company
router
  .route('/:cname')
  .get(
    requireAuth,
    SchemaValidator(joiSchema.getCompany),
    companyCtrl.getCompany,
  );

// update basic info
router
  .route('/:cname/basic')
  .put(
    requireAuth,
    SchemaValidator(joiSchema.updateBasicInfo),
    companyCtrl.updateBasicInfo,
  );

// update about
router
  .route('/:cname/about')
  .put(
    requireAuth,
    SchemaValidator(joiSchema.updateAbout),
    companyCtrl.updateAbout,
  );

// update about
router
  .route('/:cname/changeName')
  .put(
    requireAuth,
    SchemaValidator(joiSchema.changeName),
    companyCtrl.changeName,
  );

// .delete(
//   requireAuth,
//   // SchemaValidator(joiSchema.deleteCompany),
//   companyCtrl.deleteCompany,
// );

// companies list for individual user
router
  .route('/individual/:account')
  .get(requireAuth, companyCtrl.getCompanyIndividual);

// redirect to member
router.use('/:cname/members', memberRoutes);
// redirect to department
router.use('/:cname/departments', deptRoutes);
// redirect to designation
router.use('/:cname/designations', designationRoutes);

router.param('cname', companyCtrl.getCompanyLoad);

module.exports = router;
