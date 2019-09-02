const express = require("express");
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
  .post(requireAuth, permit('user', 'admin'), chatCtrl.create);

  router.route("/init")
  .post(requireAuth, permit('user', 'admin'), chatCtrl.init);


module.exports = router;
