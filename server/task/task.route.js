const express = require('express');
const passport = require('passport');
const taskCtrl = require('./task.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./task.validation');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit } = require('./../helpers/permission');
const router = express.Router();

router.route('/')
  .get(requireAuth, permit('user', 'admin'), taskCtrl.list)
  .post(
    requireAuth,
    permit('user', 'admin'),
    SchemaValidator(joiSchema.createTask),
    taskCtrl.create
  );

router.route('/:taskId')
  .get(requireAuth, permit('user', 'admin'), taskCtrl.get)
  .patch(
    requireAuth, 
    permit('user', 'admin'), 
    // TODO: Will do in next push
    // SchemaValidator(joiSchema.updateTask),
    taskCtrl.update,
  );

router.route('/dragTask')
  .post(
    requireAuth,
    permit('user', 'admin'),
    SchemaValidator(joiSchema.dragTask),
    taskCtrl.dragTask
  )

router.param('taskId', taskCtrl.load);

module.exports = router;