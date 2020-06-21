const express = require('express');
const subCtrl = require('./subscription.controller');
const companyCtrl = require('../company/company.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const subSchema = require('./subscription.validation');

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();

// For TigrowWebApp users
// router
//   .route('/plan-id-find')
//   .get(
//     SchemaValidator(planSchema.planName),
//     planCtrl.findPlanIdForCompany,
//   );

// for Admin panel
router
  .route('/subscription-archive')
  .put(subCtrl.subscriptionDenyFromAdmin);
router
  .route('/subscription-history')
  .get(subCtrl.subscriptionHistoryForAdmin);
router
  .route('/')
  .post(
    authorization,
    SchemaValidator(subSchema.createSubscription),
    subCtrl.createSubscriptionForCompany,
  )
  .get(subCtrl.allSubscriptionPlanFromAdminPanel);

router
  .route('/:companyId')
  .get(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    subCtrl.subscriptionExpireCheck(),
    SchemaValidator(subSchema.currentSubscriptionPlan),
    subCtrl.currentSubscriptionPlan,
  )
  .put(
    authorization,
    companyCtrl.authorizeUser('superAdmin'),
    SchemaValidator(subSchema.changeSubscriptionPlan),
    subCtrl.changeSubscriptionPlan,
  );
router
  .route('/:companyId/renew-subscription')
  .put(
    authorization,
    companyCtrl.authorizeUser('superAdmin'),
    SchemaValidator(subSchema.renewSub),
    subCtrl.renewSubscription,
  );

module.exports = router;
