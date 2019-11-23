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
      .populate([
        { path: 'account', select: '_id name firstName lastName' },
      ]);
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
      .populate('account', '_id name email firstName lastName')
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

// 1st step: Find member list from company.
// 2nd step: Create a list of employee
// 3rd step: Exclude them from the Team Search

const searchMember = async (req, res, next) => {
  try {
    const name = req.query.name;
    const companyID = req.company._id;
    const company = await Company.findById({
      _id: companyID,
    }).populate('members', 'account');
    logger.info(`Company Information: ${company}`);
    let memberListId = company.members;
    logger.info(`memberList: ${memberListId}`);
    memberListId = memberListId.map(member => member.account);
    logger.info(`memberList in company: ${memberListId}`);
    await Account.find({
      $and: [
        { name: { $regex: new RegExp(name) } },
        { _id: { $nin: memberListId } },
      ],
    })
      .select('_id email name firstName lastName')
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
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

module.exports = {
  addMember,
  list,
  getMember,
  getMemberLoad,
  searchMember,
};
