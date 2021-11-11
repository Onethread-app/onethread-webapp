const express = require('express');
const labelCtrl = require('./label.controller');
const subCtrl = require('../subscription/subscription.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const router = express.Router();
const joiSchema = require('./label.validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

router.use('/', subCtrl.subscriptionExpireCheck());

router
  .route('/')
  .post(
    authorization,
    SchemaValidator(joiSchema.createLabel),
    labelCtrl.createLabel,
  );

router
  .route('/suggest')
  .get(
    authorization,
    SchemaValidator(joiSchema.suggestLabel),
    labelCtrl.suggestLabel,
  );

router
  .route('/task/:task')
  .get(
    authorization,
    SchemaValidator(joiSchema.getTaskLabel),
    labelCtrl.getTaskLabels,
  )
  .post(
    authorization,
    SchemaValidator(joiSchema.createTaskLabel),
    labelCtrl.createTaskLabel,
  );

router
  .route('/task-label/:taskLabel')
  .delete(
    authorization,
    SchemaValidator(joiSchema.deleteLabel),
    labelCtrl.deleteLabel,
  );

router
  .route('/:label')
  .get(authorization, labelCtrl.labelDetails)
  .put(
    authorization,
    SchemaValidator(joiSchema.createLabel),
    labelCtrl.updateLabel,
  );

module.exports = router;
