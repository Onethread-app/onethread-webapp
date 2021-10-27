const express = require('express');
const taskStatusCtrl = require('./taskStatus.controller');
const SchemaValidator = require('../../helpers/joiSchemaValidator');
const joiSchema = require('./taskStatus.validation');
const projectCtrl = require('../../project/project.controller');
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');

const router = express.Router();
const subCtrl = require('../../subscription/subscription.controller');

// OK
router
  .route('/')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    taskStatusCtrl.list,
  )
  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.createTaskStatus),
    taskStatusCtrl.create,
  );

router
  .route('/:taskStatusId')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.updateTaskStatus),
    taskStatusCtrl.update,
  );

router.param('taskStatusId', taskStatusCtrl.load);

module.exports = router;
