const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./save.validation");
const saveCtrl = require("./save.controller");
const passport = require('passport');
const passportService = require('../../config/passport');
const requireAuth = passport.authenticate('jwt', {session: false});
//const accCtrl = require("../../account/save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  .get(saveCtrl.list)
  .post(validate(paramValidation.createSave), requireAuth, saveCtrl.create);

router
  .route("/:saveId")
  .get(saveCtrl.get)
  .delete(saveCtrl.remove);

router.param("saveId", saveCtrl.load);

module.exports = router;
