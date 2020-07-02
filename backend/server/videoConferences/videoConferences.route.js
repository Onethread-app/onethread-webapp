const express = require('express');
const router = express.Router({ mergeParams: true });
const vcCtrl = require('./videoConferences.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./videoConferences.validation');

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

// router.route('/get-joinee').get(authorization, vcCtrl.getJoinee);
router
  .route('/get-conferences')
  .get(authorization, vcCtrl.getAllRecordsForVideoConference);
router
  .route('/save-record')
  .post(
    authorization,
    SchemaValidator(joiSchema.newRecord),
    vcCtrl.createVideoConferencRecord,
  );

module.exports = router;
