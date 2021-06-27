const express = require('express');
const passport = require('passport');
const subTaskCtrl = require('./subtask.controller');
const SchemaValidator = require('./../../helpers/joiSchemaValidator');
const joiSchema = require('./subtask.validation');
const subCtrl = require('../../subscription/subscription.controller');
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');
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

router
  .route('/:subTaskId/member')
  .post(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.addMember),
    subTaskCtrl.addMember,
  )
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    subTaskCtrl.getMembers,
  )
  .delete(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.deleteMember),
    subTaskCtrl.deleteMember,
  );

router
  .route('/:subTaskId/search')
  .get(
    authorization,
    SchemaValidator(joiSchema.searchMember),
    subTaskCtrl.searchMember,
  );

router.param('subTaskId', subTaskCtrl.load);

module.exports = router;
