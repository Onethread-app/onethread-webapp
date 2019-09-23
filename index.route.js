'use strict';

const express = require('express');
const accountRoutes = require('./server/account/account.route');
const userRoutes = require('./server/registereduser/user.route');
const companyRoutes = require('./server/company/company.route');
const categoryRoutes = require('./server/category/category.route');
const messageRoutes = require('./server/message/message.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

// mount account user routes at /account
router.use('/account', accountRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount company routes at /company
router.use('/category', categoryRoutes);
router.use('/company', companyRoutes);
router.use('/message', messageRoutes);

module.exports = router;
