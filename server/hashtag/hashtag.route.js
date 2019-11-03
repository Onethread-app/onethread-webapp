const express = require("express");
//const validate = require("express-validation");
//const paramValidation = require("./hashtag.validation");
const hashtagCtrl = require("./hashtag.controller");
//const {permit, authSelf} = require('../helpers/permission');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
router
  .route("/")
  .get(hashtagCtrl.suggest)
  .post( requireAuth, hashtagCtrl.create);  //validate(paramValidation.createSave),


//router.param("commentId", commentCtrl.load);

module.exports = router;
