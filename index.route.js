'use strict';

const express = require('express');
const accountRoutes = require('./server/account/account.route');
const userRoutes = require('./server/registereduser/user.route');
const companyRoutes = require('./server/company/company.route');
const categoryRoutes = require('./server/category/category.route');
const postRoutes = require('./server/post/post.route');
const reactRoutes = require('./server/react/react.route');
const saveRoutes = require('./server/save/save.route');
const commentRoutes = require('./server/comment/comment.route');
//const chatRoutes = require('./server/chaat/chat.route');
const reportRoutes = require('./server/report/report.route');
const reviewRoutes = require('./server/review/review.route');
const hashRoutes = require('./server/hashtag/hashtag.route');
const roomRoutes = require('./server/room/room.route');
const messageRoutes = require('./server/message/message.route');
// const authRoutes = require('./server/auth/auth.route');

const skillRoutes = require('./server/skillArea/skillArea.route');
const imageRoutes = require('./server/image/image.route');
const chatkitRoutes = require('./server/chatkit/chatkit.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

// mount account user routes at /account
router.use('/account', accountRoutes);
router.use('/skill', skillRoutes);

router.use('/posts', postRoutes);
router.use('/reacts', reactRoutes);
router.use('/saves', saveRoutes);
//router.use('/chats', chatRoutes);
router.use('/comments', commentRoutes);
router.use('/reports', reportRoutes);
router.use('/reviews', reviewRoutes);
router.use('/hashtags', hashRoutes);
router.use('/category', categoryRoutes);
// mount user routes at /users
router.use('/users', userRoutes);
router.use('/room', roomRoutes);
router.use('/category', categoryRoutes);
router.use('/company', companyRoutes);
router.use('/message', messageRoutes);
router.use('/upload', imageRoutes);
router.use('/chatkit', chatkitRoutes);

// router.use('/message', messageRoutes);
module.exports = router;
