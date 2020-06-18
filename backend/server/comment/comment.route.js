const express = require('express');
const paramValidation = require('./comment.validation');
const commentCtrl = require('./comment.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./comment.validation');

const router = express.Router();

router
  .route('/')
  .get(authorization, commentCtrl.list)
  .post(
    authorization,
    SchemaValidator(joiSchema.create),
    commentCtrl.create,
  );

router.param('commentId', commentCtrl.load);

module.exports = router;
