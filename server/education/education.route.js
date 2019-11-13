const express = require('express');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('./../helpers/permission');
const educationCtrl = require('./education.controller');

const router = express.Router();

router
  .route('/add-education')
  .post(requireAuth, educationCtrl.addEducation);

router
  .route('/update-education')
  .put(requireAuth, educationCtrl.updateEducation);
// router
//   .route('/:jobexperienceid')
//   .get(requireAuth, jobCtrl.getJobExperience);
// router
//   .route('/job-experience-update')
//   .put(requireAuth, jobCtrl.updateJobExperience);

// router.route('/').get(requireAuth, jobCtrl.getAllJobExperience);
// router.param('jobexperienceid', jobCtrl.jobExperienceLoad);
module.exports = router;
