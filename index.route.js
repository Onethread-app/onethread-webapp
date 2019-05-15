const express = require('express');
const postRoutes = require('./server/post/post.route');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const registerRoutes = require('./server/registration/individual/user.route');
const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount register user routes at /register
router.use('/register', registerRoutes);
router.use('/posts', postRoutes);
// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
