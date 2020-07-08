const express = require('express');
const passport = require('passport');
const subTaskCtrl = require('./subtask.controller');
const SchemaValidator = require('./../../helpers/joiSchemaValidator');
const joiSchema = require('./subtask.validation');
const subCtrl = require('../../subscription/subscription.controller');
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');
const { permit } = require('./../../helpers/permission');
const router = express.Router();

router.use('/', subCtrl.subscriptionExpireCheck());

router
  .route('/')
  .get(
    authorization,
    subTaskCtrl.list,
  )
  .post(
    authorization,
    // permit('user', 'admin'),
    SchemaValidator(joiSchema.createSubTask),
    subTaskCtrl.create,
  );

router
  .route('/:subTaskId')
  .get(
    authorization,
    // permit('user', 'admin'),
    subTaskCtrl.get,
  )
  .put(
    authorization,
    // permit('user', 'admin'),
    SchemaValidator(joiSchema.updateSubTask),
    subTaskCtrl.update,
  )
  .delete(
    authorization,
    SchemaValidator(joiSchema.deleteSubtask),
    subTaskCtrl.deleteSubtask,
  );

router.param('subTaskId', subTaskCtrl.load);

module.exports = router;
