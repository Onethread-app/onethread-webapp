const express = require('express');
<<<<<<< HEAD
const validate = require('express-validation');

=======
>>>>>>> 0a20eca7dd2eff30d007b24dfdc69cba4d065f36
const router = express.Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./company.validation');
const companyCtrl = require('./company.controller');
const { permit } = require('./../helpers/permission');
const typeInfo = require('./typeInfo/typeInfo.route');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
// company type's info
router.use('/typeInfo', typeInfo);

// for company profile
router
  .route('/profile')
  .post(
    SchemaValidator(joiSchema.newCompany),
    companyCtrl.createCompanyProfile
  );
router
  .route('/profile/:id')
  .get(
    requireAuth,
    permit('company'),
    SchemaValidator(joiSchema.getCompany),
    companyCtrl.getCompanyProfile
  )
  .put(
    requireAuth,
    permit('company'),
    SchemaValidator(joiSchema.updateCompany),
    companyCtrl.updateCompanyProfile
  )
  .delete(
    requireAuth,
    permit('user'),
    SchemaValidator(joiSchema.deleteCompany),
    companyCtrl.deleteCompanyProfile
  );

module.exports = router;
