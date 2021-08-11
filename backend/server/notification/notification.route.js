const express = require('express');
const schemaValidator = require('../helpers/joiSchemaValidator');
const notificationValidator = require('./notification.validation');
const router = express.Router();

const notificationCtrl = require('./notification.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

// router.route('/:companyId').get(authorization, notificationCtrl.list);
router.route('/get').get(authorization, notificationCtrl.list);

// router
// .route('/test/:companyId')
// .get(
//   authorization,
//   notificationCtrl.test,
// );

router
  .route('/markallread')
  .put(
    authorization,
    schemaValidator(notificationValidator.markAllAsRead),
    notificationCtrl.markAllAsRead,
  );

router
  .route('/read/:userNotificationId')
  .get(authorization, notificationCtrl.read);

router.route('/seen').get(authorization, notificationCtrl.seen);

module.exports = router;
