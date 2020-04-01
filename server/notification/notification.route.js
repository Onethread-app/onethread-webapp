const express = require('express');
const router = express.Router();

const notificationCtrl = require('./notification.controller');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

router
  .route('/')
  .get(
    authorization,
    notificationCtrl.list,
  );

  router
  .route('/test')
  .get(
    
    notificationCtrl.listtest,
  );

router
  .route('/:notificationId')
  .get(
    authorization,
    notificationCtrl.read,
  );

router
  .route('/seen')
  .get(
    authorization,
    notificationCtrl.seen,
  );


module.exports = router;
