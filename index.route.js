const express = require('express');
const postRoutes = require('./server/post/post.route');
const reactRoutes = require('./server/react/react.route');
const saveRoutes = require('./server/save/save.route');
const commentRoutes = require('./server/comment/comment.route');
const reportRoutes = require('./server/report/report.route');
const reviewRoutes = require('./server/review/review.route');
const hashRoutes = require('./server/hashtag/hashtag.route');
// const authRoutes = require('./server/auth/auth.route');
const accountRoutes = require('./server/account/account.route');
const userRoutes = require('./server/registereduser/user.route');
const companyRoutes = require('./server/company/company.route');
const categoryRoutes = require('./server/category/category.route');
const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check serviomce health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount account user routes at /account
router.use('/account', accountRoutes);

router.use('/posts', postRoutes);
router.use('/reacts', reactRoutes);
router.use('/saves', saveRoutes);
router.use('/comments', commentRoutes);
router.use('/reports', reportRoutes);
router.use('/reviews', reviewRoutes);
router.use('/hashtags', hashRoutes);
router.use('/category', categoryRoutes);
// mount user routes at /users
router.use('/users', userRoutes);

// mount company routes at /company
router.use('/company', companyRoutes);

// mount auth routes at /auth
//router.use('/auth', authRoutes);

module.exports = router;
