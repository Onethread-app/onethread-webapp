const express = require('express');
const router = express.Router();

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const conferencesCtrl = require('./conferences.controller');

router.route('/video/token').get(conferencesCtrl.getToken);
router.route('/video/token').post(conferencesCtrl.postToken);

module.exports = router;
