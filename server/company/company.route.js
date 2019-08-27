const express = require('express');
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
  .route('/')
  .post(
    SchemaValidator(joiSchema.newCompany),
    companyCtrl.createCompanyProfile
  );
router
  .route('/:id')
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
