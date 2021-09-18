const express = require('express');

const router = express.Router();
const schemaValidator = require('../helpers/joiSchemaValidator');
const contactValidation = require('./contact.validation');

const contactCtrl = require('./contact.controller');
// authentication
router
  .route('/contact-sale')
  .post(schemaValidator(contactValidation.create), contactCtrl.sendMail);
// router.route('/view-mail').get(contactCtrl.viewMail);
module.exports = router;
