const Account = require('../account/account.model');
const { Team } = require('./team.model');
const { Member } = require('../company/member/member.model');
const {
  PendingMember,
} = require('../company/member/pendingMember.model');
const { Project } = require('../project/project.model');
const { PendingTeam } = require('./pendingteam.model');
const { ProjectRequest } = require('../request/request.model');
const {
  Subscription,
} = require('../subscription/subscription.model');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const {
  createTeamAddNotification,
} = require('../notification/notification.controller');
const {
  sendInviteTeamMember,
} = require('../services/email.services');

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
        await Team.create(members);
      }

      const allTeamMembers = await Team.find({
        account: { $in: accounts },
        project: req.query.pid,
      }).populate({
        path: 'account',
        select: '_id name firstName lastName email',
      });

      createTeamAddNotification(projectOwner, allTeamMembers, {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      });

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
      return sendErrorResponse(res, 404, 'MemberIdNotFoundError', {
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
      .select('_id member')
      .exec();

    let companyMembers = await Member.find({
      company: req.params.companyId,
    })
      .select('_id account')
      .populate('account', '_id name firstName lastName email')
      .exec();

    let teams = companyMembers.filter((cm) => {
      return !projectMembers.some((pm) => {
        return pm.member._id.toString() === cm._id.toString();
      });
    });

    return sendJSONresponse(res, 200, {
      teams,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// TODO: Previous remove member check in colleague
// TODO: Previous remove member check in team
const bulkInsertTeam = async (req, res, next) => {
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {
      message: "Expects 'application/json'",
    });
  }
  try {
    const emails = req.body;
    const companyId = req.headers.companyid;
    const pid = req.query.pid;
    const planMemberAllow = await Subscription.find({
      company: companyId,
      isActive: true,
    })
      .sort({ _id: -1 })
      .populate('plan company', 'maxTier name');
    let maxNumAllow = planMemberAllow[0].plan.maxTier;
    let companyName = planMemberAllow[0].company.name;
    if (emails.length >= maxNumAllow) {
      return sendErrorResponse(res, 400, 'LimitExceedError', {
        message: 'Limit is exceed',
      });
    }
    // check project owner or not
    const projectOwner = await Project.findOne({
      _id: pid,
    });

    if (projectOwner.company.toString() === companyId) {
      // if mail already exist in tigrow
      const haveAccount = await Account.find({
        email: emails,
      })
        .select('email')
        .exec();
      let haveAccountEmails = haveAccount.map((c) => {
        return c.email;
      });
      if (haveAccount) {
        // find the existing email account id
        let haveAccountIds = haveAccount.map((c) => {
          return c._id.toString();
        });
        // if account holder exist in company
        let inColleague = await Member.find({
          account: haveAccountIds,
          company: req.headers.companyid,
        }).select('member account');
        if (inColleague) {
          // check if this member add previously in the project
          inColleague.forEach(async (data) => {
            let prevMembers = await Team.findOne({
              account: data.account,
              project: pid,
              removed: true,
            }).select('account');
            // if prevMem is empty
            // then add member into team
            if (prevMembers === undefined) {
              let newMember = await Team.create({
                account: data.account,
                project: pid,
                member: data._id,
                role: 'member',
              });
              logger.info(
                `Team: send notification to newly add team members`,
              );
              createTeamAddNotification(projectOwner, newMember, {
                _id: req.user._id,
                name: req.user.name,
                pusherSock: req.headers.clientid,
              });
            } else {
              await Team.updateOne(
                { account: data.account, project: pid },
                {
                  removed: false,
                },
              );
              logger.info(
                `Team: previous member re-add into the team`,
              );
            }
          });
        }
        let haveColleagueAccounts = inColleague.map((c) => {
          return c.account.toString();
        });
        let inviteInColleague = haveAccountIds.filter(
          (el) => !haveColleagueAccounts.includes(el),
        );
        // add each account into the colleague
        inviteInColleague.forEach(async (data) => {
          let memberId = await Member.create({
            account: data,
            company: companyId,
            removed: false,
            role: 'employee',
          });
          // add memberIn into the team
          let teamId = await Team.create({
            member: memberId._id,
            account: data,
            project: pid,
            role: 'member',
            removed: false,
          });
          logger.info(`${memberId._id} add into project ${pid}`);
          createTeamAddNotification(projectOwner, teamId, {
            _id: req.user._id,
            name: req.user.name,
            pusherSock: req.headers.clientid,
          });
        });
      }
      //email need to send
      let inviteEmailUsers = emails.filter(
        (el) => !haveAccountEmails.includes(el),
      );
      // create a pending member request
      inviteEmailUsers.forEach(async (data) => {
        let pendingMember = await PendingMember.create({
          email: data,
          company: companyId,
          removed: false,
        });
        // create a pending Team request
        let pendingTeam = await PendingTeam.create({
          email: data,
          project: pid,
          removed: false,
        });
        sendInviteTeamMember(req.user._id, companyName, data);
      });
    } else {
      const memberAllowNumber = await ProjectRequest.findOne({
        project: req.query.pid,
      }).select('size');
      if (memberAllowNumber.size >= emails.length) {
        return sendErrorResponse(res, 400, 'LimitExceedError', {
          message: `You can not add more than ${memberAllowNumber.size}`,
        });
      }

      const haveAccount = await Account.find({
        email: emails,
      })
        .select('email')
        .exec();
      let haveAccountEmails = haveAccount.map((c) => {
        return c.email;
      });
      if (haveAccount) {
        // find the existing email account id
        let haveAccountIds = haveAccount.map((c) => {
          return c._id.toString();
        });
        // if account holder exist in company
        let inColleague = await Member.find({
          account: haveAccountIds,
          company: req.headers.companyid,
        }).select('member account');
        if (inColleague) {
          // check if this member add previously in the project
          inColleague.forEach(async (data) => {
            let prevMembers = await Team.findOne({
              account: data.account,
              project: pid,
              removed: true,
            }).select('account');
            // if prevMem is empty
            // then add member into team
            if (prevMembers === undefined) {
              let newMember = await Team.create({
                account: data.account,
                project: pid,
                member: data._id,
                role: 'member',
              });
              logger.info(
                `Team: send notification to newly add team members`,
              );
              createTeamAddNotification(projectOwner, newMember, {
                _id: req.user._id,
                name: req.user.name,
                pusherSock: req.headers.clientid,
              });
            } else {
              await Team.updateOne(
                { account: data.account, project: pid },
                {
                  removed: false,
                },
              );
              logger.info(
                `Team: previous member re-add into the team`,
              );
            }
          });
        }
        let haveColleagueAccounts = inColleague.map((c) => {
          return c.account.toString();
        });
        let inviteInColleague = haveAccountIds.filter(
          (el) => !haveColleagueAccounts.includes(el),
        );
        // add each account into the colleague
        inviteInColleague.forEach(async (data) => {
          let memberId = await Member.create({
            account: data,
            company: companyId,
            removed: false,
            role: 'employee',
          });
          // add memberIn into the team
          let teamId = await Team.create({
            member: memberId._id,
            account: data,
            project: pid,
            role: 'member',
            removed: false,
          });
          logger.info(`${memberId._id} add into project ${pid}`);
          createTeamAddNotification(projectOwner, teamId, {
            _id: req.user._id,
            name: req.user.name,
            pusherSock: req.headers.clientid,
          });
        });
      }
      //email need to send
      let inviteEmailUsers = emails.filter(
        (el) => !haveAccountEmails.includes(el),
      );
      // create a pending member request
      inviteEmailUsers.forEach(async (data) => {
        let pendingMember = await PendingMember.create({
          email: data,
          company: companyId,
          removed: false,
        });
        // create a pending Team request
        let pendingTeam = await PendingTeam.create({
          email: data,
          project: pid,
          removed: false,
        });
        sendInviteTeamMember(req.user._id, companyName, data);
      });
    }
    return sendJSONresponse(res, 200, {
      message: 'successfully add into the team',
    });
  } catch (error) {
    logger.error(`Team: ${error}`);
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
  associateListInProject,
  bulkInsertTeam,
};
