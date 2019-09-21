const express = require("express");
const passportService = require('../services/passport.services');
const validate = require("express-validation");
//const paramValidation = require("./comment.validation");
const chatCtrl = require("./chat.controller");
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');

const router = express.Router();

router
  .route("/")
  .get(  chatCtrl.index)
  .post(requireAuth, chatCtrl.create);

  router.route("/init")
  .post(requireAuth, chatCtrl.init);


module.exports = router;
