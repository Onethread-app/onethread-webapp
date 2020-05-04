const express = require('express');
const router = express.Router();

const notificationCtrl = require('./notification.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

<<<<<<< HEAD
router.route('/:companyId').get(authorization, notificationCtrl.list);

router
  .route('/webpush')
  .post(authorization, notificationCtrl.userTokenFCM);
=======
router.route('/').get(authorization, notificationCtrl.list);
>>>>>>> 4e99f05f... code style issue fixed

// router
// .route('/test/:companyId')
// .get(
//   authorization,
//   notificationCtrl.test,
// );

router
  .route('/read/:userNotificationId')
  .get(authorization, notificationCtrl.read);

router
  .route('/seen/:companyId')
  .get(authorization, notificationCtrl.seen);

module.exports = router;
