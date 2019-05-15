"use strict";

const express = require("express");
const validate = require("express-validation");
const paramValidation = require("../../../config/param-validation");
const router = express.Router();
const jwt = require("express-jwt");
const userCtrl = require("./user.controller");

// authentication
router
  .route("/user")
  .post(validate(paramValidation.register), userCtrl.register);
router.route("/login").post(userCtrl.login);

module.exports = router;
