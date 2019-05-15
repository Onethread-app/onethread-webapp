const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./post.validation');
const psotCtrl = require('./post.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(psotCtrl.list)
  .post(validate(paramValidation.createPost), psotCtrl.create); 
  
router.route('/:postId')
  .get(psotCtrl.get)
  .put(validate(paramValidation.updatePost), psotCtrl.update)
  .delete(psotCtrl.remove);

router.route('/likes/:postId')
  .get(psotCtrl.like);

router.route('/respectes/:postId')
  .get(psotCtrl.respect);



router.param('postId', psotCtrl.load);

module.exports = router;
