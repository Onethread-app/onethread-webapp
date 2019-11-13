const express = require('express');
const router = express.Router();
const chatkitCtrl = require('./chatkit.controller');

// authenticate a user with chatkit
router.route('/authenticate').post(chatkitCtrl.authenticate);

module.exports = router;
