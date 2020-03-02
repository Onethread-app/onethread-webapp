const Account = require('../../account/account.model');
const { Member } = require('./member.model');
const { PendingMember } = require('./pendingMember.model');
const logger = require('../../../config/winston');
const { sendJSONresponse } = require('../../helpers/jsonResponse');
const {
  sendInviteColleague,
} = require('../../services/email.services');

const changeRole = async (req, res, next) => {
  try {
    // check role: superAdmin/admin
    const member = await Member.findOne({
      account: req.user._id,
      company: req.company._id,
    });

    if (!['superAdmin', 'admin'].includes(member.role)) {
      return res.status(403).json({
        message: `Restricted`,
      });
    }

    req.member.role = req.body.role;

    await req.member.save();

    return res.status(201).json({
      message: `Role updated to ${req.body.role}`,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// add team member
const addMember = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    if (!req.body.members.length && !req.body.pendingTeamMembers) {
      return res.status(400).json({
        message: `No members or newMembers found`,
      });
    }
    const members = await Member.create(req.body.members);

    let pendingMembers = [];

    if (req.body.pendingTeamMembers.length) {
      let pendingMembersInfo = req.body.pendingTeamMembers.map(m => {
        return { email: m, company: req.company._id };
      });
      pendingMembers = await PendingMember.create(pendingMembersInfo);

      sendInviteColleague(
        req.user.email,
        req.company,
        req.body.pendingTeamMembers,
      );
    }

    return res.status(201).json({
      message: 'New member created and invitation send',
      members,
      pendingMembers,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// get all members for a company
const list = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const members = await Member.find({
      company: req.company._id,
      removed: false,
    })
      .sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit)
      .select('-__v -company -createdAt -updatedAt')
      .populate([
        {
          path: 'account',
          select: '_id name firstName lastName email',
        },
        {
          path: 'designations',
          select: 'division department position',
          populate: [{ path: 'department', select: 'name' }],
        },
      ]);
    return res.status(200).json({
      members,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const pendingList = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const pendingMember = await PendingMember.find({
      company: req.company._id,
      removed: false,
    })
      .sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit)
      .select('-__v -company -createdAt -updatedAt');
    return res.status(200).json({
      pendingMember,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const checkInvitedMemberStatus = async (req, res, next) => {
  try {
    const pendingMember = await PendingMember.findOne({
      email: req.query.email,
      company: req.company._id,
      removed: false,
    }).select('-__v -company -createdAt -updatedAt');

    return res.status(200).json({
      status: !pendingMember ? true : false,
      message: !pendingMember
        ? `${req.query.email} can be invited.`
        : `${req.query.email} has already been invited.`,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// get a member
const getMember = (req, res, next) => {
  return res.status(200).json({
    member: req.member,
  });
};

// delete a member
const deleteMember = async (req, res, next) => {
  try {
    // check role: superAdmin/admin
    const member = await Member.findOne({
      account: req.user._id,
      company: req.company._id,
    });

    if (!['superAdmin', 'admin'].includes(member.role)) {
      return res.status(403).json({
        message: `Restricted`,
      });
    }

    req.member.removed = true;

    await req.member.save();

    return res.status(200).json({
      message: 'member deleted successfully',
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// member will be found on req.member
const getMemberLoad = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.memberId)
      .populate('account', 'name email firstName lastName')
      .populate('company', 'name');

    if (member) {
      req.member = member;
      return next();
    } else {
      return res.status(404).json({
        message: 'No valid entry found for provided Member ID',
      });
    }
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// 1st step: Find member list from company.
// 2nd step: Create a list of employee
// 3rd step: Exclude them from the Team Search

const searchMember = async (req, res, next) => {
  try {
    const email = req.query.email;
    const companyID = req.company._id;

    const members = await Member.find({
      company: companyID,
      removed: false,
    });

    let memberListId = members.map(member => member.account);

    let data = await Account.find({
      $and: [
        { email: { $regex: new RegExp(email) } },
        { _id: { $nin: memberListId } },
      ],
    })
      .skip(0)
      .limit(+10)
      .select('_id email name firstName lastName');

    return sendJSONresponse(res, 200, {
      employees: {
        message: `Search complete ${email}`,
        data,
      },
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

module.exports = {
  addMember,
  list,
  pendingList,
  getMember,
  deleteMember,
  getMemberLoad,
  searchMember,
  changeRole,
  checkInvitedMemberStatus,
};
