'use strict';
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./category.validation');
const router = express.Router();
const categoryCtrl = require('./category.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('./../helpers/permission');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
// authentication
router
  .route('/')
  .get(
    authorization,
    validate(paramValidation.getCategory),
    categoryCtrl.getCategory,
  )
  .post(
    authorization,
    // requireAuth,
    // permit('admin'),
    validate(paramValidation.newCategory),
    categoryCtrl.newCategory,
  );
router
  .route('/:cid')
  .get(authorization, categoryCtrl.getSubCategory)
  .post(
    authorization,
    // requireAuth,
    // permit('admin'),
    validate(paramValidation.newSubCategory),
    categoryCtrl.newSubCategory,
  )
  .delete(
    requireAuth,
    permit('admin'),
    validate(paramValidation.deleteCategory),
    categoryCtrl.deleteCategory,
  );
router.route('/sub-category/:sid').post(
  authorization,
  // requireAuth,
  // permit('admin'),
  validate(paramValidation.newSubSubCategory),
  categoryCtrl.newSubSubCategory,
);
router
  .route('/products/:companyId')
  .get(authorization, categoryCtrl.getSubSubCategory);

module.exports = router;
