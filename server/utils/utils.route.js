const express = require('express');
const router = express.Router();
const utilsCtrl = require('./utils.controller');

router.route('/email-checker').post(utilsCtrl.EmailIDExist);
router.route('/change-username').put(utilsCtrl.changeUserName);
module.exports = router;
