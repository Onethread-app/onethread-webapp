const express = require('express');
const passport = require('passport');
//const joiSchema = require("./board.validation");
//const SchemaValidator = require("./../helpers/joiSchemaValidator");

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('./../helpers/permission');
const jobCtrl = require('./job.controller');

const router = express.Router();

router
  .route('/create-job-experience')
  .post(requireAuth, jobCtrl.createJobExperience);
// router
//   .route('/:jobexperienceid')
//   .get(requireAuth, jobCtrl.getJobExperience);
// router
//   .route('/job-experience-update')
//   .put(requireAuth, jobCtrl.updateJobExperience);
// router.param('jobexperienceid', jobCtrl.jobExperienceLoad);
module.exports = router;
