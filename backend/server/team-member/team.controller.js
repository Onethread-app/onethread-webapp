const { Team } = require('./team.model');
const { Member } = require('../company/member/member.model');
const { Project } = require('../project/project.model');
const { Room } = require('../room/room.model');
const { ProjectRequest } = require('../request/request.model');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const {
  createTeamAddNotification,
} = require('../notification/notification.controller');

const { createRoomMember } = require('../room/room.controller');
const {
  triggerUnreadNotifications,
} = require('../services/webpush.services');

const changeRole = async (req, res, next) => {
  try {
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

// project team members

const projectTeamMembers = async (pid) => {
  const limit = 50;
  const skip = 0;

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
            select: '_id name firstName lastName email profileImage',
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
          {
            path: 'associate',
            select: 'associateCompany company',
            populate: {
              path: 'associateCompany company',
              select: '_id name type _id name type',
            },
          },
        ],
      },
    ]);

  return members;
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
      let accounts = members.map((member) => member.account);

      // find previous members
      let prevMembers = await Team.find({
        account: { $in: accounts },
        project: req.query.pid,
        removed: true,
      }).select('account');
      prevMembers = prevMembers.map((member) => member.account);
      // filter new members
      members = members.filter((member) => {
        return !prevMembers.some((prevMemberAccount) => {
          return (
            prevMemberAccount.toString() === member.account.toString()
          );
        });
      });

      if (prevMembers.length) {
        // re-add team members
        await Team.updateMany(
          { account: { $in: prevMembers }, project: req.query.pid },
          {
            removed: false,
          },
        );
      }

      if (members.length) {
        // add new team members
        members = members.map((e) => {
          return {
            account: e.account,
            project: req.query.pid,
            member: e.member,
            role: 'member',
          };
        });
        const team = await Team.create(members);
        // finding general room
        const room = await Room.findOne({
          name: 'General',
          project: req.query.pid,
        });
        members.map(async (e) => {
          // create room member
          await createRoomMember(
            req.params.companyId,
            req.query.pid,
            e.account,
            room._id,
            team[0]._id,
          );
          await createTeamAddNotification(
            req.user._id,
            req.params.companyId,
            req.query.pid,
            e.account,
            {
              _id: req.user._id,
              name: req.user.name,
              pusherSock: req.headers.clientid,
            },
          );
        });
      }
      return sendJSONresponse(res, 201, {
        message: 'New Team created',
      });
    } else {
      const memberAllowNumber = await ProjectRequest.findOne({
        project: req.query.pid,
      }).select('size');
      accounts = members.map((member) => member.account);
      // find previous members
      let prevMembers = await Team.find({
        account: { $in: accounts },
        project: req.query.pid,
        removed: true,
      }).select('account');
      prevMembers = prevMembers.map((member) => member.account);
      // filter new members
      members = members.filter((member) => {
        return !prevMembers.some((prevMemberAccount) => {
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
        members.forEach(async (account) => {
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
    logger.error(`Team: ${error}`);
    next(error);
  }
};

// get all members in a project
const list = async (req, res, next) => {
  try {
    const { pid } = req.query;
    const members = await projectTeamMembers(pid);
    return sendJSONresponse(res, 200, {
      memberList: members,
    });
  } catch (error) {
    logger.error(`Team: ${error}`);
    next(error);
  }
};

const associateListInProject = async (req, res, next) => {
  try {
    const companyId = req.headers.companyid;
    const { limit = 50, skip = 0, pid } = req.query;
    let associateList = await Project.findOne({ _id: pid })
      .sort({
        createdAt: 1,
      })
      .skip(+skip)
      .limit(+limit)
      .select('associate')
      .populate({
        path: 'associate',
        select: 'associateCompany company',
        populate: {
          path: 'associateCompany company',
          select: '_id name type _id name type',
        },
      });
    let associate = associateList.associate;
    associate.map((company) => {
      if (company.company._id.toString() === companyId) {
        company.company = undefined;
      }
      if (company.associateCompany._id.toString() === companyId) {
        company.associateCompany = undefined;
      }
      return company;
    });
    return sendJSONresponse(res, 200, associate);
  } catch (error) {
    logger.error(`Team: ${error}`);
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
    const member = await Team.findOne({
      member: req.params.memberId,
      project: req.query.pid,
    })
      .populate('account', 'name email firstName lastName')
      .populate('project', 'name');
    if (member) {
      req.member = member;
      return next();
    } else {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'No valid entry found for provided Member ID',
      });
    }
  } catch (error) {
    logger.error(`Team: ${error}`);
    next(error);
  }
};

const searchTeamMember = async (req, res, next) => {
  try {
    let projectMembers = await Team.find({ project: req.query.pid })
      .select('_id member removed')
      .exec();

    let companyMembers = await Member.find({
      company: req.params.companyId,
    })
      .select('_id account removed')
      .populate('account', '_id name firstName lastName email')
      .exec();

    let teams = companyMembers.filter((cm) => {
      if (cm.removed === false) {
        return !projectMembers.some((pm) => {
          if (pm.removed === false) {
            return pm.member._id.toString() === cm._id.toString();
          }
        });
      }
    });

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
  projectTeamMembers,
  list,
  getMember,
  getMemberLoad,
  searchTeamMember,
  changeRole,
  associateListInProject,
};
