const express = require('express');
const accountRoutes = require('./server/account/account.route');
const companyRoutes = require('./server/company/company.route');
const categoryRoutes = require('./server/category/category.route');
const postRoutes = require('./server/post/post.route');
const reactRoutes = require('./server/react/react.route');
const saveRoutes = require('./server/save/save.route');
const commentRoutes = require('./server/comment/comment.route');
const reportRoutes = require('./server/report/report.route');
const reviewRoutes = require('./server/review/review.route');
const hashRoutes = require('./server/hashtag/hashtag.route');
const roomRoutes = require('./server/room/room.route');
const skillRoutes = require('./server/skillArea/skillArea.route');
const imageRoutes = require('./server/image/image.route');
const messageRoutes = require('./server/message/message.route');
const jobRoutes = require('./server/job/job.route');
const educationRoutes = require('./server/education/education.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

// mount account user routes at /account
router.use('/account', accountRoutes);
router.use('/category', categoryRoutes);

router.use('/comments', commentRoutes);
router.use('/company', companyRoutes);
router.use('/education', educationRoutes);
router.use('/hashtags', hashRoutes);
router.use('/job', jobRoutes);
router.use('/posts', postRoutes);
router.use('/reacts', reactRoutes);
router.use('/reports', reportRoutes);
router.use('/reviews', reviewRoutes);
router.use('/rooms', roomRoutes);
router.use('/saves', saveRoutes);
router.use('/skill', skillRoutes);
router.use('/upload', imageRoutes);
router.use('/message', messageRoutes);
router.use('/job', jobRoutes);
router.use('/education', educationRoutes);
// router.use('/message', messageRoutes);
module.exports = router;
