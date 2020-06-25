const express = require('express');
const planCtrl = require('./plan.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const planSchema = require('./plan.validation');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const router = express.Router();

// For TigrowWebApp users
router
  .route('/plan-id-find')
  .get(
    SchemaValidator(planSchema.planName),
    planCtrl.findPlanIdForCompany,
  );

// for Admin panel
router.route('/').get(authorization, planCtrl.allPlanList);

// router
//   .route('/:planId')
//   .get(
//     SchemaValidator(planSchema.getSinglePlan),
//     planCtrl.getSinglePlanForAdmin,
//   )
//   .put(
//     SchemaValidator(planSchema.updatePlan),
//     planCtrl.updatePlanFromAdmin,
//   );

module.exports = router;
