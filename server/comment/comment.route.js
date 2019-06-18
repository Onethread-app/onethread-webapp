const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./comment.validation");
const commentCtrl = require("./comment.controller");
<<<<<<< HEAD
=======
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');

>>>>>>> master
const router = express.Router();

router
  .route("/")
<<<<<<< HEAD
  .get(commentCtrl.list)
  .post(validate(paramValidation.createSave), commentCtrl.create);

router
  .route("/:commentId")
  .get(commentCtrl.get)
  .delete(commentCtrl.remove);
=======
  .get( requireAuth, commentCtrl.list)
  .post(requireAuth, validate(paramValidation.createSave), commentCtrl.create);

router
  .route("/:commentId")
  .get(requireAuth, commentCtrl.get)
  .delete(requireAuth, commentCtrl.remove);

router.route('/likes/:commentId')
  .get(requireAuth, commentCtrl.like);

router.route('/respectes/:commentId')
  .get(requireAuth, commentCtrl.respect);

>>>>>>> master

router.param("commentId", commentCtrl.load);

module.exports = router;
