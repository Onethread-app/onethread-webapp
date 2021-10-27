const express = require('express');
const taskCtrl = require('./task.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./task.validation');
const subCtrl = require('../subscription/subscription.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const router = express.Router();

// OK
router.get('/reminder', taskCtrl.taskReminder);
router.use('/', subCtrl.subscriptionExpireCheck());

// OK
router
  .route('/')
  .post(
    authorization,
    SchemaValidator(joiSchema.createTask),
    taskCtrl.create,
  );

// OK
router
  .route('/:taskId')
  .get(authorization, taskCtrl.get)
  .put(
    authorization,
    SchemaValidator(joiSchema.updateTask),
    taskCtrl.update,
  )
  .delete(
    authorization,
    SchemaValidator(joiSchema.deleteTask),
    taskCtrl.deleteTask,
  );

// OK
router
  .route('/suggest-member')
  .get(authorization, taskCtrl.suggestMemberForCreatingTask);

router
  .route('/member/:taskId')
  .get(authorization, taskCtrl.getMembers)
  .post(
    authorization,
    SchemaValidator(joiSchema.addMember),
    taskCtrl.addMember,
  )
  .delete(
    authorization,
    SchemaValidator(joiSchema.deleteMember),
    taskCtrl.deleteMember,
  );

router
  .route('/dragTask')
  .post(
    authorization,
    SchemaValidator(joiSchema.dragTask),
    taskCtrl.dragTask,
  );

// OK
router
  .route('/:taskId/suggest-member')
  .get(authorization, taskCtrl.suggestMember);

// OK
router.param('taskId', taskCtrl.load);

module.exports = router;
