const express = require('express');

const router = express.Router();
const channel = require('./channel.controller');
const { authorization } = require('../middlewares/authorizationMiddleware');

// authenticate a user with pusher-channel
router.route('/authenticate').post(authorization, channel.authenticate);

module.exports = router;
