const express = require('express');
const router = express.Router({ mergeParams: true });

// const auth = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./company.validation');
const companyCtrl = require('./company.controller');
const subCtrl = require('../subscription/subscription.controller');
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
// list all companies
// create company
// router.route('/list').get(companyCtrl.getAllCompanies);
router
  .route('/user-role-company')
  .get(authorization, companyCtrl.adminSuperAdminFinder);
router
  .route('/search')
  .get(
    authorization,
    SchemaValidator(joiSchema.search),
    companyCtrl.searchCompany,
  );
// get company
router.route('/:cname').get(
  authorization,
  // subCtrl.subscriptionExpireCheck(),
  SchemaValidator(joiSchema.getCompany),
  companyCtrl.getCompany,
);

// update basic info
router
  .route('/:companyId/basic')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.updateBasicInfo),
    companyCtrl.updateBasicInfo,
  );

// update about
router
  .route('/:companyId/about')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.updateAbout),
    companyCtrl.updateAbout,
  );
router
  .route('/:companyId/certification')
  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    companyCtrl.addCertifications,
  )
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.editCertification),
    companyCtrl.editCertification
  );

// change name
router
  .route('/:companyId/changeName')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.changeName),
    companyCtrl.changeName,
  );

router
  .route('/:companyId/role')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.changeRole),
    companyCtrl.updateRole,
  );
router
  .route('/:companyId/announcements')
  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.createNotice),
    companyCtrl.noticePostByCompany,
  );
router
  .route('/:companyId/announcements')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    SchemaValidator(joiSchema.allNoticesForCompany),
    companyCtrl.allNoticesForCompany,
  );

// 		);

router
  .route('/:companyId/dashboard')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    SchemaValidator(joiSchema.dashboard),
    companyCtrl.dashBoard,
  );

// companies list for individual user
router
  .route('/individual/:account')
  .get(authorization, companyCtrl.getCompanyIndividual);

// redirect to member
router.use('/:companyId/members', memberRoutes);
// redirect to department
router.use('/:companyId/departments', deptRoutes);
// redirect to designation
router.use('/:companyId/designations', designationRoutes);

router.param('companyId', companyCtrl.getCompanyLoad);

module.exports = router;
