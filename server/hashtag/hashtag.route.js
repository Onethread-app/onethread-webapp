const express = require("express");
const validate = require("express-validation");
//const paramValidation = require("./hashtag.validation");
const hashtagCtrl = require("./hashtag.controller");
const router = express.Router();

router
  .route("/")
  .get(hashtagCtrl.suggest)
  .post( hashtagCtrl.create);  //validate(paramValidation.createSave),


//router.param("commentId", commentCtrl.load);

module.exports = router;
