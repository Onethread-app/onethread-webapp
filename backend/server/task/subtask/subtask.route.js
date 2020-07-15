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
const projectCtrl = require('../../project/project.controller');
const router = express.Router();

router.use('/', subCtrl.subscriptionExpireCheck());

router
  .route('/')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    subTaskCtrl.list,
  )
  .post(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.createSubTask),
    subTaskCtrl.create,
  );

router
  .route('/:subTaskId')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    subTaskCtrl.get,
  )
  .put(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.updateSubTask),
    subTaskCtrl.update,
  )
  .delete(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.deleteSubtask),
    subTaskCtrl.deleteSubtask,
  );

router.param('subTaskId', subTaskCtrl.load);

module.exports = router;
