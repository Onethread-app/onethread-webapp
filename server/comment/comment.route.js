const express = require("express");
const validate = require("express-validation");
const paramValidation = require("./comment.validation");
const commentCtrl = require("./comment.controller");
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');

const router = express.Router();

router
  .route("/")
  .get( requireAuth, permit('user', 'admin'), commentCtrl.list)
  .post(requireAuth, permit('user', 'admin'), validate(paramValidation.createSave), commentCtrl.create);

router
  .route("/:commentId")
  .get(requireAuth, permit('user', 'admin'), commentCtrl.get)
  .put(requireAuth, authSelf('comment'), validate(paramValidation.updateSave), commentCtrl.update)
  .delete(requireAuth, authSelf('comment'), commentCtrl.remove);

router.route('/likes/:commentId')
  .get(requireAuth, permit('user', 'admin'), commentCtrl.like);

router.route('/respectes/:commentId')
  .get(requireAuth, permit('user', 'admin'), commentCtrl.respect);


router.param("commentId", commentCtrl.load);

module.exports = router;
