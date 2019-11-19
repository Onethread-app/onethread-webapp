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
router.use('/message', messageRoutes);
router.use('/education', educationRoutes);
router.use('/messages', messageRoutes);
router.use('/utils', utilsRoutes);
router.use('/chatkit', chatkitRoutes);

const { Company } = require('./server/company/company.model');
const Account = require('./server/account/account.model');
const logger = require('./config/winston');
const { sendJSONresponse } = require('./server/helpers/jsonResponse');
// 1st step: Find member list from company.
// 2nd step: Create a list of employee and account holder
// 3rd step: Find account holders id
// 3rd step: Exclude them from the Team Search
router.route('/member-search').get(async (req, res, next) => {
	const name = req.query.name;
	const companyList = await Company.findById({
		_id: '5dd3ba94021b6213f419477d',
	}).populate('members account', 'account name email');
	let memberListId = companyList.members;
	memberListId = memberListId.map(account => account._id);
	memberListId = [...memberListId, '5dd42c4d30af62559ac711a2'];
	logger.info(`my members name:${memberListId}`);
	// if (name === '') {
	// 	const err = new BadRequestError(
	// 		'Nothing Submitted',
	// 		httpStatus.BAD_REQUEST,
	// 		true,
	// 	);
	// 	logger.error(`Query Error: ${err}`);
	// 	return next(err);
	// }
	await Account.find({
		$and: [
			{ name: { $regex: new RegExp(name) } },
			{ _id: { $nin: memberListId } },
		],
	})
		.select('_id email name')
		.then(data => {
			logger.info(`Search complete ${name}`);
			return sendJSONresponse(res, 200, {
				employees: {
					message: `Search complete ${name}`,
					data,
				},
			});
		})
		.catch(err => {
			logger.error(`${err}`);
			return next(err);
		});
});
module.exports = router;
