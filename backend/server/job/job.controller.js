const JobExperience = require('./job.model');
const Account = require('../account/account.model');
const {sendJSONresponse} = require('../helpers/jsonResponse.js');
const logger = require('../../config/winston');

const createJobExperience = async (req, res, next) => {
	const account = await Account.findById(req.user._id);
	const newJobExperience = new JobExperience({
		companyName: req.body.companyName,
		positionName: req.body.positionName,
		startYear: req.body.startYear,
		endingYear: req.body.endingYear,
		currentlyWork: req.body.currentlyWork,
		jobDescription: req.body.jobDescription,
		account: req.user._id,
	});

	await newJobExperience
		.save()
		.then(async (data) => {
			account.jobExperience.push(data._id);
			await account.save();
			logger.info('job experience created');
			return sendJSONresponse(res, 201, {data});
		})
		.catch((err) => {
			logger.error(`Error: ${err}`);
			return next(err);
		});
};

const updateJobExperience = async (req, res, next) => {
	try {
		if (!req.is('application/json')) {
			return sendErrorResponse(res, 406, 'ContentTypeError', {
				message: 'Expects \'application/json\'',
			});
		}
		const newJobExp = await JobExperience.findByIdAndUpdate(
			{_id: req.query.jobexperienceid},
			req.body,
			{new: true},
		);
		return sendJSONresponse(res, 200, {data: newJobExp});
	} catch (error) {
		next(error);
	}
};

const getAllJobExperience = async (req, res) => {
	JobExperience.find({})
		.exec()
		.then((data) => {
			return sendJSONresponse(res, 200, {data});
		})
		.catch((err) => {
			logger.error(`Error: ${err}`);
			return next(err);
		});
};
// const getAllJobExpereicne = async (req, res) => {
//   const userid = req.user.id;
//   Account.find({ _id: userid })
//     .populate(
//       'jobExperience, companyName positionName startYear endingYear currentlyWork',
//     )
//     .exec()
//     .then(data => {
//       return sendJSONresponse(res, 200, { data });
//     })
//     .catch(err => {
//       return next(err);
//     });
// };
module.exports = {
	createJobExperience,
	updateJobExperience,
	getAllJobExperience,
};
