const express = require('express');
const jobValidation = require("./job.validation");
const SchemaValidator = require("./../helpers/joiSchemaValidator");

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const jobCtrl = require('./job.controller');

const router = express.Router();

router
  .route('/create-job-experience')
  .post(authorization,
    SchemaValidator(jobValidation.createJob), 
    jobCtrl.createJobExperience);
// router
//   .route('/:jobexperienceid')
//   .get(requireAuth, jobCtrl.getJobExperience);
router
  .route('/job-experience-update')
  .put(authorization,
    SchemaValidator(jobValidation.updateJob), 
    jobCtrl.updateJobExperience);

router.route('/').get(authorization, jobCtrl.getAllJobExperience);
// router.param('jobexperienceid', jobCtrl.jobExperienceLoad);
module.exports = router;
