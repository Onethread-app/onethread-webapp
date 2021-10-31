const express = require('express');
const subCtrl = require('./subscription.controller');
const companyCtrl = require('../company/company.controller');
const SchemaValidator = require('../helpers/joiSchemaValidator');
const subSchema = require('./subscription.validation');

const { authorization } = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router
  .route('/')
  .post(
    authorization,
    companyCtrl.authorizeUser('superAdmin'),
    SchemaValidator(subSchema.createSubscription),
    subCtrl.createSubscriptionForCompany,
  );

router
  .route('/:companyId')
  .get(
    authorization,
    // subCtrl.subscriptionExpireCheck(),
    SchemaValidator(subSchema.currentSubscriptionPlan),
    subCtrl.currentSubscriptionPlan,
  )
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('superAdmin'),
    SchemaValidator(subSchema.changeSubscriptionPlan),
    subCtrl.changeSubscriptionPlan,
  );
router
  .route('/:companyId/renew-subscription')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('superAdmin'),
    SchemaValidator(subSchema.renewSub),
    subCtrl.renewSubscription,
  );

module.exports = router;
