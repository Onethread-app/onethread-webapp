const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./comment.validation');
const commentCtrl = require('./comment.controller');
const router = express.Router();

router.route('/')
  .get(commentCtrl.list)
  .post(validate(paramValidation.createSave), commentCtrl.create);  
  
router.route('/:commentId')
  .get(commentCtrl.get)
  .delete(commentCtrl.remove);


router.param('commentId', commentCtrl.load);

module.exports = router;
