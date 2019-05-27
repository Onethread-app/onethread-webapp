const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./report.validation");
const reportCtrl = require("./report.controller");
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const permit = require('../account/permission');

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  .get(requireAuth, reportCtrl.list)
  .post(requireAuth, validate(paramValidation.createSave), reportCtrl.create);

router
  .route("/:reportId")
  .get(requireAuth, reportCtrl.get)
  .delete(requireAuth, reportCtrl.remove);

router.param("reportId", reportCtrl.load);

module.exports = router;
