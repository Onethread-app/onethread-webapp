const express = require('express');

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const SchemaValidator = require('../helpers/joiSchemaValidator');
const timeTrackerSchema = require('./time-tracker.validation');

const subCtrl = require('../subscription/subscription.controller');
const projectCtrl = require('../project/project.controller');
const trackControl = require('./time-tracker.controller');

const router = express.Router();

router.route('/user').get(authorization, trackControl.findByuser);

router.use('/', subCtrl.subscriptionExpireCheck());

router
  .route('/')
  .post(
    authorization,
    SchemaValidator(timeTrackerSchema.createTimeTracker),
    trackControl.create,
  );

router
  .route('/task')
  .get(
    authorization,
    SchemaValidator(timeTrackerSchema.findByTask),
    trackControl.findByTask,
  );

router
  .route('/subtask')
  .get(
    authorization,
    SchemaValidator(timeTrackerSchema.findBySubtask),
    trackControl.findBySubtask,
  );

router
  .route('/project')
  .get(
    authorization,
    SchemaValidator(timeTrackerSchema.findByProject),
    trackControl.findByProject,
  );

router
  .route('/company')
  .get(
    authorization,
    SchemaValidator(timeTrackerSchema.findByCompany),
    trackControl.findByCompany,
  );

module.exports = router;
