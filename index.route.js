const express = require('express');
const postRoutes = require('./server/post/post.route');
const saveRoutes = require('./server/save/save.route');
const commentRoutes = require('./server/comment/comment.route');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/posts', postRoutes);
router.use('/saves', saveRoutes);
router.use('/comments', commentRoutes);
// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
