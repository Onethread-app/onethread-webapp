const express = require('express');
const accountRoutes = require('./server/account/account.route');
const companyRoutes = require('./server/company/company.route');
const categoryRoutes = require('./server/category/category.route');
const postRoutes = require('./server/post/post.route');
const reactRoutes = require('./server/react/react.route');
// const saveRoutes = require('./server/save/save.route');
const commentRoutes = require('./server/comment/comment.route');
const reportRoutes = require('./server/report/report.route');
const reviewRoutes = require('./server/review/review.route');
const hashRoutes = require('./server/hashtag/hashtag.route');
const roomRoutes = require('./server/room/room.route');
const skillRoutes = require('./server/skillArea/skillArea.route');
const fileRoutes = require('./server/file/file.route');
const messageRoutes = require('./server/message/message.route');
const jobRoutes = require('./server/job/job.route');
const educationRoutes = require('./server/education/education.route');
const boardRoutes = require('./server/board/board.route');
const boardColumnRoutes = require('./server/boardColumn/boardColumn.route');
const taskRoutes = require('./server/task/task.route');
const utilsRoutes = require('./server/utils/utils.route');
const chatkitRoutes = require('./server/chatkit/chatkit.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

// mount account user routes at /account
router.use('/accounts', accountRoutes);
router.use('/messages', messageRoutes);
router.use('/category', categoryRoutes);
router.use('/comments', commentRoutes);
router.use('/company', companyRoutes);
router.use('/educations', educationRoutes);
router.use('/hashtags', hashRoutes);
router.use('/jobs', jobRoutes);
router.use('/posts', postRoutes);
router.use('/reacts', reactRoutes);
router.use('/reports', reportRoutes);
router.use('/reviews', reviewRoutes);
router.use('/rooms', roomRoutes);
// router.use('/saves', saveRoutes);
router.use('/skills', skillRoutes);
router.use('/files', fileRoutes);
router.use('/boards', boardRoutes);
router.use('/boardColumns', boardColumnRoutes);
router.use('/tasks', taskRoutes);
router.use('/education', educationRoutes);
router.use('/utils', utilsRoutes);
router.use('/chatkit', chatkitRoutes);

module.exports = router;
