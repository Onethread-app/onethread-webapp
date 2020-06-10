const express = require('express');

const router = express.Router({mergeParams: true});
const passport = require('passport');

// const auth = passport.authenticate('jwt', { session: false });
const {authorization} = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./company.validation');
const companyCtrl = require('./company.controller');
const SchemaValidator = require('../helpers/joiSchemaValidator');

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

router
    .route('/search')
    .get(
        authorization,
        SchemaValidator(joiSchema.search),
        companyCtrl.searchCompany,
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
    .route('/:companyId/basic')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        SchemaValidator(joiSchema.updateBasicInfo),
        companyCtrl.updateBasicInfo,
    );

// update about
router
    .route('/:companyId/about')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        SchemaValidator(joiSchema.updateAbout),
        companyCtrl.updateAbout,
    );
router
    .route('/:companyId/certification')
    .post(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        companyCtrl.addCertifications,
    );
router.route('/:companyId/parentorg').put(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    // SchemaValidator(joiSchema.parentOrg),
    companyCtrl.parentOrg,
);

// change name
router
    .route('/:companyId/changeName')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        SchemaValidator(joiSchema.changeName),
        companyCtrl.changeName,
    );

router
    .route('/:companyId/role')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        SchemaValidator(joiSchema.changeRole),
        companyCtrl.updateRole,
    );
router
    .route('/:companyId/announcements')
    .post(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        SchemaValidator(joiSchema.createNotice),
        companyCtrl.noticePostByCompany,
    );
router
    .route('/:companyId/announcements')
    .get(
        authorization,
        SchemaValidator(joiSchema.allNoticesForCompany),
        companyCtrl.allNoticesForCompany,
    );
// 		router
//   .route('/:companyId/announcements')
//   .delete(
//     authorization,
//     SchemaValidator(),
//     companyCtrl.removeNotice,
// 		);
// 		router
//   .route('/:companyId/announcements')
//   .put(
//     authorization,
//     SchemaValidator(),
//     companyCtrl.removeNotice,
// 		);

router
    .route('/:companyId/dashboard')
    .get(
        authorization,
        SchemaValidator(joiSchema.dashboard),
        companyCtrl.dashBoard,
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

// redirect to member
router.use('/:companyId/members', memberRoutes);
// redirect to department
router.use('/:companyId/departments', deptRoutes);
// redirect to designation
router.use('/:companyId/designations', designationRoutes);

router.param('companyId', companyCtrl.getCompanyLoad);

module.exports = router;
