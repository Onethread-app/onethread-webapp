const express = require('express');
const authRoutes = require('./server/auth/auth.route');
const accountRoutes = require('./server/account/account.route');
const userRoutes = require('./server/registereduser/user.route');
const companyRoutes = require('./server/company/company.route');
const postRoutes = require('./server/post/post.route');
const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check serviomce health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount account user routes at /account
router.use('/account', accountRoutes);

//router.use('/posts', postRoutes);
// mount user routes at /users
router.use('/users', userRoutes);

// mount company routes at /company
router.use('/company', companyRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
