const express = require('express');
const router = express.Router({ mergeParams: true });
const vcCtrl = require('./videoConferences.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

router.route('/get-joinee').get(authorization, vcCtrl.getJoinee);
router
  .route('/get-conferences')
  .get(authorization, vcCtrl.getAllRecordsForVideoConference);
router
  .route('/save-record')
  .post(authorization, vcCtrl.createVideoConferencRecord);

module.exports = router;
