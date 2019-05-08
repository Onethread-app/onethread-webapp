'use strict'

const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../../config/param-validation');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
const userCtrl = require('./user.controller');

// authentication
router.route('/user')
    .post(userCtrl.register);
//router.post('/login', ctrlAuth.login);

module.exports = router;