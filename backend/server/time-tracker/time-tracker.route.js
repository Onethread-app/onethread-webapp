const express = require('express');

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const SchemaValidator = require('../helpers/joiSchemaValidator');
const timeTrackerSchema = require('./time-tracker.validation');

const subCtrl = require('../subscription/subscription.controller');
const trackControl = require('./time-tracker.controller');

const router = express.Router();

router.use('/', subCtrl.subscriptionExpireCheck());

router
  .route('/')
  .post(
    authorization,
    SchemaValidator(timeTrackerSchema.createTimeTracker),
    trackControl.create,
  );

router.route('/user').get(authorization, trackControl.findByuser);

router
  .route('/task/:task')
  .get(
    authorization,
    SchemaValidator(timeTrackerSchema.findByTask),
    trackControl.findByTask,
  );

module.exports = router;
