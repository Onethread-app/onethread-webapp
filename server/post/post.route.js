'use strict';
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./post.validation');
const postCtrl = require('./post.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
<<<<<<< HEAD
  .get(requireAuth, permit('user', 'admin'), psotCtrl.list)
  .post(requireAuth, permit('user', 'admin'), validate(paramValidation.createPost), psotCtrl.create); 
  
router.route('/:postId')
  .get(requireAuth, permit('user', 'admin'), psotCtrl.get)
  .put(requireAuth, authSelf('post'), validate(paramValidation.updatePost), psotCtrl.update)
  .delete(requireAuth, authSelf('post'), psotCtrl.remove);

router.route('/likes/:postId')
  .get(requireAuth, permit('user', 'admin'), psotCtrl.like);

router.route('/respectes/:postId')
  .get(requireAuth, permit('user', 'admin'), psotCtrl.respect);
=======
  .get(requireAuth, postCtrl.list)
  .post(requireAuth, validate(paramValidation.createPost), postCtrl.create); 
  
router.route('/:postId')
  .get(requireAuth, postCtrl.get)
  .put(requireAuth, validate(paramValidation.updatePost), postCtrl.update)
  .delete(postCtrl.remove);

router.route('/likes/:postId')
  .get(requireAuth, postCtrl.like);

router.route('/respectes/:postId')
  .get(requireAuth, postCtrl.respect);
>>>>>>> 7da9b12151907919ecd25125bd4170c4742780c2



router.param('postId', postCtrl.load);

module.exports = router;
