const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./report.validation");
const reportCtrl = require("./report.controller");
<<<<<<< HEAD
=======
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');
>>>>>>> master

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
<<<<<<< HEAD
  .get(reportCtrl.list)
  .post(validate(paramValidation.createSave), reportCtrl.create);

router
  .route("/:reportId")
  .get(reportCtrl.get)
  .delete(reportCtrl.remove);
=======
  .get(requireAuth, reportCtrl.list)
  .post(requireAuth, validate(paramValidation.createSave), reportCtrl.create);

router
  .route("/:reportId")
  .get(requireAuth, reportCtrl.get)
  .delete(requireAuth, reportCtrl.remove);
>>>>>>> master

router.param("reportId", reportCtrl.load);

module.exports = router;
