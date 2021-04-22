const express = require('express');
const multer = require('multer');
const taskCtrl = require('./task.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./task.validation');
const subCtrl = require('../subscription/subscription.controller');
const projectCtrl = require('../project/project.controller');
// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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
    taskCtrl.list,
  )
  .post(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.createTask),
    taskCtrl.create,
  );

router
  .route('/:taskId')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    taskCtrl.get,
  )
  .put(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.updateTask),
    taskCtrl.update,
  );

router
  .route('/member/:taskId')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    taskCtrl.getMembers,
  )
  .post(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.addMember),
    taskCtrl.addMember,
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
    taskCtrl.deleteMember,
  );

router
  .route('/dragTask')
  .post(
    authorization,
    SchemaValidator(joiSchema.dragTask),
    taskCtrl.dragTask,
  );

router
  .route('/:taskId/suggest-member')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    taskCtrl.suggestMember,
  );

router.param('taskId', taskCtrl.load);

module.exports = router;
