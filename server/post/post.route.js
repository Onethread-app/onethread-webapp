const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./post.validation');
const psotCtrl = require('./post.controller');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const permit = require('../account/permission');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
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

module.exports = router;
