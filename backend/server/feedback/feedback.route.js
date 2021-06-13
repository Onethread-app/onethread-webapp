const express = require('express');
const router = express.Router();
const schemaValidator = require('../helpers/joiSchemaValidator');
const feedbackValidation = require('./feedback.validation');

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const feedbackCtrl = require('./feedback.controller');

router
  .route('/')
  .post(
    authorization,
    schemaValidator(feedbackValidation.create),
    feedbackCtrl.create,
  );

module.exports = router;
