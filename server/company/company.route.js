const express = require('express');
const router = express.Router();
const passport = require('passport');

// const auth = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
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
    authorization,
    SchemaValidator(joiSchema.newCompany),
    companyCtrl.createCompany,
  );

// get company
router
  .route('/:cname')
  .get(
    authorization,
    SchemaValidator(joiSchema.getCompany),
    companyCtrl.getCompany,
  );

// update basic info
router
  .route('/:cname/basic')
  .put(
    authorization,
    SchemaValidator(joiSchema.updateBasicInfo),
    companyCtrl.updateBasicInfo,
  );

// update about
router
  .route('/:cname/about')
  .put(
    authorization,
    SchemaValidator(joiSchema.updateAbout),
    companyCtrl.updateAbout,
  );

// update about
router
  .route('/:cname/changeName')
  .put(
    authorization,
    SchemaValidator(joiSchema.changeName),
    companyCtrl.changeName,
  );

// .delete(
//   auth,
//   // SchemaValidator(joiSchema.deleteCompany),
//   companyCtrl.deleteCompany,
// );

// companies list for individual user
router
  .route('/individual/:account')
  .get(authorization, companyCtrl.getCompanyIndividual);

router.route('/search').get(authorization, companyCtrl.searchCompany);
// redirect to member
router.use('/:cname/members', memberRoutes);
// redirect to department
router.use('/:cname/departments', deptRoutes);
// redirect to designation
router.use('/:cname/designations', designationRoutes);

router.param('cname', companyCtrl.getCompanyLoad);

module.exports = router;
