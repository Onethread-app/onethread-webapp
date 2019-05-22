const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./save.validation");
const saveCtrl = require("./save.controller");
const passport = require('passport');
//const passportService = require('../account/services/passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const permit = require('../account/permission');
//const accCtrl = require("../../account/save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  .get(requireAuth, permit('user'), saveCtrl.list)
  .post(requireAuth, permit('user'), validate(paramValidation.createSave), saveCtrl.create);

router
  .route("/:saveId")
  .get(requireAuth, permit('user'), saveCtrl.get)
  .delete(saveCtrl.remove);

router.param("saveId", saveCtrl.load);

module.exports = router;
