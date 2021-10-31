const express = require('express');
const { validate } = require('express-validation');
const passport = require('passport');
const paramValidation = require('./post.validation');
const psotCtrl = require('./post.controller');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  .get(requireAuth, permit('user', 'admin'), psotCtrl.list)
  .post(
    requireAuth,
    permit('user', 'admin'),
    validate(paramValidation.createPost),
    psotCtrl.create,
  );

router
  .route('/:postId')
  .get(requireAuth, permit('user', 'admin'), psotCtrl.get)
  .put(
    requireAuth,
    authSelf('post'),
    validate(paramValidation.updatePost),
    psotCtrl.update,
  )
  .delete(requireAuth, authSelf('post'), psotCtrl.remove);

// router.route('/likes/:postId')
//   .get(requireAuth, permit('user', 'admin'), psotCtrl.like);

// router.route('/respectes/:postId')
//   .get(requireAuth, permit('user', 'admin'), psotCtrl.respect);

router.param('postId', psotCtrl.load);

module.exports = router;
