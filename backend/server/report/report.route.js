const express = require('express');
const ReportIssueController = require('./report.controller');
const schemaValidator = require('../helpers/joiSchemaValidator');
const ReportIssueValidation = require('./report.validation');

const router = express.Router();
const { authorization } = require('../middlewares/authorizationMiddleware');

router
  .route('/')
  .post(
    authorization,
    schemaValidator(ReportIssueValidation.create),
    ReportIssueController.reportPost,
  );

module.exports = router;
