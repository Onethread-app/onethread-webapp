const express = require('express');
const router = express.Router();
const passport = require('passport');
// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');
const joiSchema = require('./member.validation');
const memberCtrl = require('./member.controller');

const SchemaValidator = require('../../helpers/joiSchemaValidator');

router.route('/search').get(authorization, memberCtrl.searchMember);
router
  .route('/')
  .post(
    authorization,
    // TODO: member validations
    // SchemaValidator(joiSchema.newMember),
    memberCtrl.addMember,
  )
  .get(authorization, memberCtrl.list);

router
  .route('/:memberId')
  .get(
    authorization,
    SchemaValidator(joiSchema.getMember),
    memberCtrl.getMember,
  );

//   .put(
//     authorization,
//     // SchemaValidator(joiSchema.updateCompany),
//     companyCtrl.updateCompany,
//   )
//   .delete(
//     authorization,
//     // SchemaValidator(joiSchema.deleteCompany),
//     companyCtrl.deleteCompany,
//   );

// router.route('/:cname/employees').put(
//   authorization,
//   // SchemaValidator(joiSchema.getCompany),
//   companyCtrl.addEmployees,
// );

router.param('memberId', authorization, memberCtrl.getMemberLoad);

module.exports = router;
