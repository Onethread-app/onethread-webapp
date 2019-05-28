"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../config/param-validation");
const router = express.Router();
const jwt = require("express-jwt");
const passportService = require("./../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });
const accountCtrl = require("./controller/account.controller");
const userCtrl = require("./controller/user.controller");
const companyCtrl = require("./controller/company.controller");
const auth = require("./auth");
const permit = require("./../helpers/permission");
// authentication
router.route("/signup").post(accountCtrl.register);

router.route("/change_password").post(accountCtrl.changePassword);

router.route("/send").get(accountCtrl.confirmationMail);

router.route("/verify").get(accountCtrl.verifyAccount);

//router
//  .route('/forget_password')
//  .post( accountCtrl.forgetPassword);

router.route("/login").post(requireLogin, accountCtrl.login);

// for admin
router.route("/admin").post(requireAuth, permit("admin"), accountCtrl.login);

// router
//   .route("/admin/create_category")
//   .post(requireAuth, permit('admin'), accountCtrl.createCategory);

// router
//   .route("/profile")
//   .get(requireAuth, permit('admin'), accountCtrl.profileList);

// for individual users
router
  .route("/profile/:id")
  .post(requireAuth, permit("user"), userCtrl.createProfile)
  .get(requireAuth, permit("user"), userCtrl.profile);
router
  .route("/profile/:id")
  .put(requireAuth, permit("user"), userCtrl.profileUpdate)
  .delete(requireAuth, permit("user"), userCtrl.profileDelete);

// for company users
router
  .route("/company/:id")
  .post(requireAuth, permit("company"), companyCtrl.createProfile)
  .get(requireAuth, permit("company"), companyCtrl.profile)
  .put(requireAuth, permit("company"), companyCtrl.profileUpdate)
  .delete(requireAuth, permit("company"), companyCtrl.profileDelete);

// for all registered account

module.exports = router;
