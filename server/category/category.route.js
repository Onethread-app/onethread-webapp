"use strict";
const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./category.validation");
const router = express.Router();
const categoryCtrl = require("./category.controller");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const { permit, authSelf } = require("./../helpers/permission");
// authentication
router
  .route("/")
  .get(validate(paramValidation.getCategory), categoryCtrl.getCategory)
  .post(
    requireAuth,
    permit("admin"),
    validate(paramValidation.newCategory),
    categoryCtrl.newCategory
  );
router
  .route("/:cid")
  .get(categoryCtrl.getSubCategory)
  .post(
    requireAuth,
    permit("admin"),
    validate(paramValidation.newSubCategory),
    categoryCtrl.newSubCategory
  )
  .delete(
    requireAuth,
    permit("admin"),
    validate(paramValidation.deleteCategory),
    categoryCtrl.deleteCategory
  );
router
  .route("/sub-category/:sid")
  .get(categoryCtrl.getSubSubCategory)
  .post(
    requireAuth,
    permit("admin"),
    validate(paramValidation.newSubSubCategory),
    categoryCtrl.newSubSubCategory
  );

module.exports = router;
