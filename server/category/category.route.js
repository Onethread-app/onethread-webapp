"use strict";
const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./category.validation");
const router = express.Router();
const categoryCtrl = require("./category.controller");
const passport = require("passport");
const passportConfig = require("./../account/services/passport");
const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });
// authentication
router
  .route("/")
  .get(categoryCtrl.getCategory)
  .post(
    passportJWT,
    validate(paramValidation.newCategory),
    categoryCtrl.newCategory
  );
router
  .route("/:cid")
  .get(categoryCtrl.getSubCategory)
  .post(
    passportJWT,
    validate(paramValidation.newSubCategory),
    categoryCtrl.newSubCategory
  );
router
  .route("/sub-category/:sid")
  .get(categoryCtrl.getSubSubCategory)
  .post(
    passportJWT,
    validate(paramValidation.newSubSubCategory),
    categoryCtrl.newSubSubCategory
  );
// router.route("/all").get(passportJWT, userCtrl.getUsers);
// router.route("/:userId").delete(passportJWT, userCtrl.deleteUser);

module.exports = router;
