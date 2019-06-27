const express = require('express');
const validate = require('express-validation');
//const paramValidation = require('./save.validation');
const reviewCtrl = require('./review.controller');
const passport = require('passport');
// const passportService = require('../account/services/passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');
// const accCtrl = require("../../account/save.controller");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  .get(requireAuth, permit('user', 'admin'), reviewCtrl.list)
  .post(
    //requireAuth,
    
    reviewCtrl.create
  ); 
//   permit('user', 'admin'),
//     validate(paramValidation.createSave),



router.param('reviewId', reviewCtrl.load);

module.exports = router;
