const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./save.validation");
const saveCtrl = require("./save.controller");
const passport = require('passport');
<<<<<<< HEAD
const passportService = require('../../config/passport');
const requireAuth = passport.authenticate('jwt', {session: false});
=======
//const passportService = require('../account/services/passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');
>>>>>>> master
//const accCtrl = require("../../account/save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
<<<<<<< HEAD
  .get(saveCtrl.list)
  .post(validate(paramValidation.createSave), requireAuth, saveCtrl.create);

router
  .route("/:saveId")
  .get(saveCtrl.get)
  .delete(saveCtrl.remove);
=======
  .get(requireAuth, permit('user'), saveCtrl.list)
  .post(requireAuth, permit('user'), validate(paramValidation.createSave), saveCtrl.create);

router
  .route("/:saveId")
  .get(requireAuth, permit('user'), saveCtrl.get)
  .delete(requireAuth,  saveCtrl.remove); // 
>>>>>>> master

router.param("saveId", saveCtrl.load);

module.exports = router;
