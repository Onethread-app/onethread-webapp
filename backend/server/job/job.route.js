const express = require('express');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const schemaValidator = require('../helpers/joiSchemaValidator');
const jobValidation = require('./job.validation');
const jobCtrl = require('./job.controller');

const router = express.Router();

router
  .route('/create-job-experience')
  .post(
    authorization,
    schemaValidator(jobValidation.createJobExperience),
    jobCtrl.createJobExperience,
  );
router
  .route('/job-experience-update')
  .put(
    authorization,
    schemaValidator(jobValidation.updateJobExperience),
    jobCtrl.updateJobExperience,
  );

router.route('/').get(authorization, jobCtrl.getAllJobExperience);
// router.param('jobexperienceid', jobCtrl.jobExperienceLoad);
module.exports = router;
