const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./member.validation');
const memberCtrl = require('./member.controller');

const SchemaValidator = require('../../helpers/joiSchemaValidator');

router.route('/search').get(memberCtrl.searchMember);
router
  .route('/')
  .post(
    requireAuth,
    // TODO: member validations
    // SchemaValidator(joiSchema.newMember),
    memberCtrl.addMember,
  )
  .get(requireAuth, memberCtrl.list);

router
  .route('/:memberId')
  .get(
    requireAuth,
    SchemaValidator(joiSchema.getMember),
    memberCtrl.getMember,
  );

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

router.param('memberId', requireAuth, memberCtrl.getMemberLoad);

module.exports = router;
