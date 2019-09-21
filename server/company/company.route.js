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
router.route('/').post(
  requireAuth,
  // SchemaValidator(joiSchema.newCompany),
  companyCtrl.createCompany,
);
router
  .route('/:id')
  .get(
    requireAuth,
    // SchemaValidator(joiSchema.getCompany),
    companyCtrl.getCompany,
  )
  .put(
    requireAuth,
    SchemaValidator(joiSchema.updateCompany),
    companyCtrl.updateCompany,
  )
  .delete(
    requireAuth,
    SchemaValidator(joiSchema.deleteCompany),
    companyCtrl.deleteCompany,
  );

module.exports = router;
