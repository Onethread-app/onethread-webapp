const express = require('express');
const paymentCtrl = require('./payment.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const paymentSchema = require('./payment.validation');
const companyCtrl = require('../company/company.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const router = express.Router();

// For TigrowWebApp users
router
  .route('/stripe/intent')
  .post(
    authorization,
    SchemaValidator(paymentSchema.intent),
    paymentCtrl.paymentIntent,
  );

router
  .route('/:companyId')
  .post(
    authorization,
    companyCtrl.authorizeUser('all', 'superAdmin'),
    SchemaValidator(paymentSchema.create),
    paymentCtrl.create,
  )
  .get(
    authorization,
    companyCtrl.authorizeUser('all', 'superAdmin'),
    paymentCtrl.list,
  );



module.exports = router;
