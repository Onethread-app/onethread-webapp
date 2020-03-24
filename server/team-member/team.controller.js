const Account = require('../account/account.model');
const { Team } = require('./team.model');
const { Member } = require('../company/member/member.model');
const { Project } = require('../project/project.model');
const { Company } = require('../company/company.model');
const { ProjectRequest } = require('../request/request.model');
const { Room } = require('../room/room.model');
const { chatkit } = require('../services/pusher.services');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const changeRole = async (req, res, next) => {
  try {
    // check role: superAdmin/admin
    const member = await Team.findOne({
      member: req.user._id,
      company: req.query.pid,
    });

    if (req.body.role !== 'admin' || member.role !== 'admin') {
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
const addTeamMember = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {
      message: "Expects 'application/json'",
    });
  }

  try {
    // check if this company is own the project
    const projectOwner = await Project.findOne({
      _id: req.query.pid,
    });
    let members = req.body.members;
    if (projectOwner.company.toString() === req.params.companyId) {
      let accounts = members.map(member => member.account);
      // find previous members
      let prevMembers = await Team.find({
        account: { $in: accounts },
        project: req.query.pid,
        removed: true,
      }).select('account');
      prevMembers = prevMembers.map(member => member.account);
      // filter new members
      members = members.filter(member => {
        return !prevMembers.some(prevMemberAccount => {
          return (
            prevMemberAccount.toString() === member.account.toString()
          );
        });
      });
      await Team.updateMany(
        { account: { $in: prevMembers }, project: req.query.pid },
        {
          removed: false,
        },
      );
      members.forEach(async account => {
        console.log(account);
        await Team.create({
          account: account.account,
          project: req.query.pid,
          member: account.member,
          role: 'member',
        });
      });
      return sendJSONresponse(res, 201, {
        message: 'New Team created',
      });
    } else {
      const memberAllowNumber = await ProjectRequest.findOne({
        project: req.query.pid,
      }).select('size');
      accounts = members.map(member => member.account);
      // find previous members
      let prevMembers = await Team.find({
        account: { $in: accounts },
        project: req.query.pid,
        removed: true,
      }).select('account');
      prevMembers = prevMembers.map(member => member.account);
      // filter new members
      members = members.filter(member => {
        return !prevMembers.some(prevMemberAccount => {
          return (
            prevMemberAccount.toString() === member.account.toString()
          );
        });
      });
      await Team.updateMany(
        { account: { $in: prevMembers }, project: req.query.pid },
        {
          removed: false,
        },
      );

      if (memberAllowNumber.size >= req.body.members.length) {
        // need to insertMany method later
        let members = req.body.members;
        members.forEach(async account => {
          await Team.insertMany({
            account: account.account,
            project: req.query.pid,
            member: account.member,
            role: 'member',
          });
        });
        return sendJSONresponse(res, 200, {
          message: 'special member add to project',
        });
      } else {
        return sendErrorResponse(res, 400, 'LimitExceedError', {
          message: `you are not allow more than ${memberAllowNumber.size}`,
        });
      }
    }
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// get all members in a project
const list = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, pid } = req.query;
    const members = await Team.find({
      $and: [{ project: pid }, { removed: false }],
    })
      .sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit)
      .select('role')
      .populate([
        {
          path: 'member',
          select: '_id account designations',
          populate: [
            {
              path: 'account',
              select: '_id name firstName lastName email',
            },
            {
              path: 'designations',
              select: 'division department position',
              populate: [{ path: 'department', select: 'name' }],
            },
          ],
        },
        {
          path: 'project',
          select: 'company associate',
          populate: [
            { path: 'associate', select: 'associateCompany' },
          ],
        },
      ]);

    return res.status(200).json({
      memberList: members,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// get a member
const getMember = (req, res, next) => {
  try {
    return res.status(200).json({
      member: req.member,
    });
  } catch (error) {
    next(error);
  }
};

// member will be found on req.member
const getMemberLoad = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.memberId)
      .populate('account', 'name email firstName lastName')
      .populate('project', 'name');

    if (member) {
      req.member = member;
      return next();
    } else {
      return sendErrorResponse(res, 404, 'MemberIdNotFoundError', {
        message: 'No valid entry found for provided Member ID',
      });
    }
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const searchTeamMember = async (req, res, next) => {
  try {
    let projectMembers = await Team.find({ project: req.query.pid })
      .select('_id member')
      .exec();

    let companyMembers = await Member.find({
      company: req.params.companyId,
    })
      .select('_id account')
      .populate('account', '_id name firstName lastName email')
      .exec();

    let teams = companyMembers.filter(cm => {
      return !projectMembers.some(pm => {
        return pm.member._id.toString() === cm._id.toString();
      });
    });

    teams = teams.map(t => t.account);

    return sendJSONresponse(res, 200, {
      teams,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

module.exports = {
  addTeamMember,
  list,
  getMember,
  getMemberLoad,
  searchTeamMember,
  changeRole,
};
