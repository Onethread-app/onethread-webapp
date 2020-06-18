const express = require('express');
const passport = require('passport');
//const joiSchema = require("./board.validation");
//const SchemaValidator = require("./../helpers/joiSchemaValidator");

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const { permit, authSelf } = require('./../helpers/permission');
const jobCtrl = require('./job.controller');

const router = express.Router();

router
  .route('/create-job-experience')
  .post(authorization, jobCtrl.createJobExperience);
// router
//   .route('/:jobexperienceid')
//   .get(requireAuth, jobCtrl.getJobExperience);
router
  .route('/job-experience-update')
  .put(authorization, jobCtrl.updateJobExperience);

router.route('/').get(authorization, jobCtrl.getAllJobExperience);
// router.param('jobexperienceid', jobCtrl.jobExperienceLoad);
module.exports = router;
