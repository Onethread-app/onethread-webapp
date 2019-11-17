const Account = require('../../account/account.model');
const { Member } = require('./member.model');
const { Company } = require('../company.model');
const { Room } = require('./../../room/room.model');
const { chatkit } = require('../../services/pusher.services');
const logger = require('../../../config/winston');
const { sendJSONresponse } = require('../../helpers/jsonResponse');
const {
	BadRequestError,
	SearchNotMatchError,
} = require('../../helpers/APIError.js');

// add team member
const addMember = async (req, res, next) => {
	// Check for JSON
	if (!req.is('application/json')) {
		return res.send("Expects 'application/json'");
	}

	try {
		const members = await Member.create(req.body.members);
		if (!members.length) {
			return res.status(400).json({
				status: false,
				message: `No members created`,
			});
		}

		let membersId = members.map(m => {
			return m._id;
		});

		let accountsId = req.body.members.map(m => {
			return m.account;
		});

		// save ref in company
		req.company.members.addToSet(...membersId);
		await req.company.save();

		// add members into General room
		const room = await Room.findOne({
			name: 'General',
			company: req.company._id,
		});
		if (room) {
			room.members.addToSet(...accountsId);
			await room.save();
			await chatkit.addUsersToRoom({
				roomId: room._id,
				userIds: accountsId,
			});
		}

		return res.status(201).json({
			status: true,
			message: 'New member created',
			members,
		});
	} catch (error) {
		next(error);
	}
};

// get all members for a company
const list = async (req, res, next) => {
	try {
		const { limit = 50, skip = 0 } = req.query;

		const members = await Member.find({
			company: req.company._id,
		})
			.sort({ createdAt: 1 })
			.skip(+skip)
			.limit(+limit)
			.select('-__v -company -createdAt -updatedAt')
			.populate([{ path: 'account', select: '_id name' }]);
		return res.status(200).json({
			status: true,
			members,
		});
	} catch (error) {
		next(error);
	}
};

// get a member
const getMember = (req, res, next) => {
	return res.status(200).json({
		status: true,
		member: req.member,
	});
};

// member will be found on req.member
const getMemberLoad = async (req, res, next) => {
	try {
		const member = await Member.findById(req.params.memberId)
			.populate('account', '_id name email')
			.populate('company', '_id name email address');

		if (member) {
			req.member = member;
			return next();
		} else {
			return res.status(404).json({
				status: false,
				message: 'No valid entry found for provided Member ID',
			});
		}
	} catch (error) {
		next(error);
	}
};

const searchMember = async (req, res, next) => {
	const name = req.query.name;
	const companyList = await Company.findById({
		_id: req.company._id,
	});
	const memberListId = companyList.members;
	const accountId = [];
	const id = memberListId.find(item => accountId.push(item._id));
	console.log(req);
	console.log(accountId);
	if (name === '') {
		const err = new BadRequestError(
			'Nothing Submitted',
			httpStatus.BAD_REQUEST,
			true,
		);
		logger.error(`Query Error: ${err}`);
		return next(err);
	}
	Account.find({ $and: { name: { $regex: name, $nin: accountId } } })
		.select('_id email name')
		.then(data => {
			logger.info(`Search complete ${name}`);
			return sendJSONresponse(res, 200, {
				employees: {
					success: true,
					message: `Search complete ${name}`,
					data,
				},
			});
		})
		.catch(err => {
			logger.error(`${err}`);
			return next(err);
		});
};

module.exports = {
	addMember,
	list,
	getMember,
	getMemberLoad,
	searchMember,
};
