const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./save.validation');
const saveCtrl = require('./save.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  //.get(psotCtrl.list)
  .post(validate(paramValidation.createSave), saveCtrl.create);  
  
// router.route('/:postId')
//   .get(psotCtrl.get)
//   .put(validate(paramValidation.updatePost), psotCtrl.update)
//   .delete(psotCtrl.remove);

// router.route('/likes/:postId')
//   .get(psotCtrl.like);

// router.route('/respectes/:postId')
//   .get(psotCtrl.respect);



router.param('postId', saveCtrl.load);

module.exports = router;
