const express = require('express');
const validate = require('express-validation');

const router = express.Router();

const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

const { permit, authSelf } = require('./../helpers/permission');

const paramValidation = require('./company.validation');
const companyProfileCtrl = require('./company.controller');

const typeInfo = require('./typeInfo/typeInfo.route');

// company type's info
router.use('/typeInfo', typeInfo);

// for company profile
router
  .route('/profile')
  .post(
    requireAuth,
    permit('company'),
    validate(paramValidation.newCompany),
    companyProfileCtrl.createCompanyProfile
  );
router
  .route('/profile/:id')
  .get(
    requireAuth,
    permit('company'),
    validate(paramValidation.getCompany),
    companyProfileCtrl.getCompanyProfile
  )
  .put(
    requireAuth,
    permit('company'),
    validate(paramValidation.updateCompany),
    companyProfileCtrl.updateCompanyProfile
  )
  .delete(
    requireAuth,
    permit('company'),
    validate(paramValidation.deleteCompany),
    companyProfileCtrl.deleteCompanyProfile
  );

module.exports = router;
