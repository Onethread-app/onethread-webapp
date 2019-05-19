const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./save.validation");
const saveCtrl = require("./save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  .get(saveCtrl.list)
  .post(validate(paramValidation.createSave), saveCtrl.create);

router
  .route("/:saveId")
  .get(saveCtrl.get)
  .delete(saveCtrl.remove);

router.param("saveId", saveCtrl.load);

module.exports = router;
