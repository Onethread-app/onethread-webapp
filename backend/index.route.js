const express = require('express');
const accountRoutes = require('./server/account/account.route');
const companyRoutes = require('./server/company/company.route');
const categoryRoutes = require('./server/category/category.route');
const postRoutes = require('./server/post/post.route');
const projectRoutes = require('./server/project/project.route');
// const reactRoutes = require('./server/react/react.route');
// const saveRoutes = require('./server/save/save.route');
const commentRoutes = require('./server/comment/comment.route');
// const reportRoutes = require('./server/report/report.route');
// const reviewRoutes = require('./server/review/review.route');
const roomRoutes = require('./server/room/room.route');
const skillRoutes = require('./server/skillArea/skillArea.route');
const fileRoutes = require('./server/file/file.route');
const messageRoutes = require('./server/message/message.route');
const notificationRoutes = require('./server/notification/notification.route');
const jobRoutes = require('./server/job/job.route');
const educationRoutes = require('./server/education/education.route');
const taskRoutes = require('./server/task/task.route');
const utilsRoutes = require('./server/utils/utils.route');
const associateRoutes = require('./server/associate/associate.route');
const teamRoutes = require('./server/team-member/team.route');
const channelRoutes = require('./server/channel/channel.route');
const contactRoutes = require('./server/contact-us/contact.route');
const planRoutes = require('./server/plan/plan.route');
const subscriptionRoutes = require('./server/subscription/subscription.route');
const paymentRoute = require('./server/payment/payment.route');
const videoConferencesRoute = require('./server/videoConferences/videoConferences.route');
const feedbackRoutes = require('./server/feedback/feedback.route');
const reportRoutes = require('./server/report/report.route');
const timeTrackerRoutes = require('./server/time-tracker/time-tracker.route');
const taskStatusRoutes = require('./server/task/taskStatus/taskStatus.route');
const labelRoutes = require('./server/label/label.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files
// TODO: rename the endpoints with hyphen and plural words

// mount account user routes at /account
router.use('/accounts', accountRoutes);
router.use('/messages', messageRoutes);
router.use('/category', categoryRoutes); // categories
router.use('/comments', commentRoutes);
router.use('/company', companyRoutes); // companies
router.use('/educations', educationRoutes);
router.use('/jobs', jobRoutes);
router.use('/posts', postRoutes);
// router.use('/reacts', reactRoutes);
// router.use('/reports', reportRoutes);
// router.use('/reviews', reviewRoutes);
router.use('/rooms', roomRoutes);
// router.use('/saves', saveRoutes);
router.use('/skills', skillRoutes);
router.use('/files', fileRoutes); // board-columns
router.use('/tasks', taskRoutes);
router.use('/taskStatus', taskStatusRoutes);
router.use('/utils', utilsRoutes);
router.use('/projects', projectRoutes);
router.use('/associate', associateRoutes); // associates
router.use('/notifications', notificationRoutes);
router.use('/channel', channelRoutes); // channels
router.use('/teams', teamRoutes);
router.use('/contact', contactRoutes); // contacts
router.use('/plans', planRoutes);
router.use('/payments', paymentRoute);
router.use('/subscriptions', subscriptionRoutes);
router.use('/video-conferences', videoConferencesRoute);
router.use('/feedback', feedbackRoutes); // feedbacks
router.use('/reports', reportRoutes);
router.use('/time-trackers', timeTrackerRoutes);
router.use('/labels', labelRoutes), (module.exports = router);
