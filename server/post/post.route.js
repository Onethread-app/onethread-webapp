<<<<<<< HEAD
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./post.validation');
const psotCtrl = require('./post.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const permit = require('../helpers/permission');
=======
'use strict';
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./post.validation');
const postCtrl = require('./post.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const {permit, authSelf} = require('../helpers/permission');
>>>>>>> master

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
<<<<<<< HEAD
  .get(requireAuth, psotCtrl.list)
  .post(requireAuth, validate(paramValidation.createPost), psotCtrl.create); 
  
router.route('/:postId')
  .get(requireAuth, psotCtrl.get)
  .put(requireAuth, validate(paramValidation.updatePost), psotCtrl.update)
  .delete(psotCtrl.remove);

router.route('/likes/:postId')
  .get(requireAuth, psotCtrl.like);

router.route('/respectes/:postId')
  .get(requireAuth, psotCtrl.respect);



router.param('postId', psotCtrl.load);
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



router.param('postId', postCtrl.load);
>>>>>>> master

module.exports = router;
