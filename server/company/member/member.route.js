const express = require('express');
const router = express.Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./member.validation');
const teamCtrl = require('./member.controller');
const { permit } = require('../../helpers/permission');
const SchemaValidator = require('../../helpers/joiSchemaValidator');

router.route('/').post(
  requireAuth,
  // SchemaValidator(joiSchema.newCompany),
  teamCtrl.addMember,
);

// router
//   .route('/:cname')
//   .get(
//     requireAuth,
//     // SchemaValidator(joiSchema.getCompany),
//     companyCtrl.getCompany,
//   )
//   .put(
//     requireAuth,
//     // SchemaValidator(joiSchema.updateCompany),
//     companyCtrl.updateCompany,
//   )
//   .delete(
//     requireAuth,
//     // SchemaValidator(joiSchema.deleteCompany),
//     companyCtrl.deleteCompany,
//   );

// router.route('/:cname/employees').put(
//   requireAuth,
//   // SchemaValidator(joiSchema.getCompany),
//   companyCtrl.addEmployees,
// );

// router.param('cname', companyCtrl.getCompanyLoad);

module.exports = router;
