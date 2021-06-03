const express = require('express');
const router = express.Router();

const webpushCtrl = require('./webpush.controller');
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');

router
  .route('/subscription')
  .post(authorization, webpushCtrl.saveSubscription);

router
  .route('/subscription/:subscriptionId')
  .delete(authorization, webpushCtrl.removeSubscription);

router
  .route('/subscription/:companyId')
  .post(authorization, webpushCtrl.triggerNotification);

module.exports = router;
