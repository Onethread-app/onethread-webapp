const express = require('express');
const passport = require('passport');

// const authorization = passport.authenticate('jwt', { session: false });auth
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const { permit, authSelf } = require('./../helpers/permission');
const educationCtrl = require('./education.controller');

const router = express.Router();

router
  .route('/add-education')
  .post(authorization, educationCtrl.addEducation);

router
  .route('/update-education')
  .put(authorization, educationCtrl.updateEducation);
// router
//   .route('/:jobexperienceid')
//   .get(authorization, jobCtrl.getJobExperience);
// router
//   .route('/job-experience-update')
//   .put(authorization, jobCtrl.updateJobExperience);

// router.route('/').get(authorization, jobCtrl.getAllJobExperience);
// router.param('jobexperienceid', jobCtrl.jobExperienceLoad);
module.exports = router;
