'use strict';
const express = require('express');
const router = express.Router();
const basicCtrl = require('./basic/basic.controller');
const basicRoutes = require('./basic/basic.route');

// get all info
router.route('/basic-info').get(basicCtrl.getAllBasicInfo);

// getting requested company's id
router.use('/:cid', (req, res, next) => {
  req.currentCompany = req.params.cid;
  next();
});

// basic routes
router.use('/:cid/basic-info', basicRoutes);

module.exports = router;
