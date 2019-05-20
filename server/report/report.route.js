const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./report.validation");
const reportCtrl = require("./report.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  .get(reportCtrl.list)
  .post(validate(paramValidation.createSave), reportCtrl.create);

router
  .route("/:reportId")
  .get(reportCtrl.get)
  .delete(reportCtrl.remove);

router.param("reportId", reportCtrl.load);

module.exports = router;
