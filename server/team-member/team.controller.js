const Account = require('../account/account.model');
const { Team } = require('./team.model');
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
      account: req.user._id,
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
    if (projectOwner.company.toString() === req.params.companyId) {
      let members = req.body.members;

      accounts = newMembers.map(member => member.account);

      // find previous members
      let prevMembers = await Team.find({
        account: { $in: accounts },
        project: req.query.pid,
        removed: true,
      }).select('account');
      prevMembers = prevMembers.map(member => member.account);
      // filter new members
      newMembers = newMembers.filter(newMember => {
        return !prevMembers.some(prevMemberAccount => {
          return (
            prevMemberAccount.toString() ===
            newMember.account.toString()
          );
        });
      });
      members.forEach(async account => {
        await Team.insertMany({
          account: account.account,
          project: account.pid,
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
      if (memberAllowNumber.size >= req.body.members.length) {
        // need to insertMany method later
        let members = req.body.members;
        members.forEach(async account => {
          await Team.insertMany({
            account: account.account,
            project: account.pid,
            role: 'specialMember',
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
    const { limit = 50, skip = 0 } = req.query;

    const members = await Team.find({
      company: req.query.pid,
      removed: false,
    })
      .sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit)
      .select('role')
      .populate([
        { path: 'account', select: '_id name firstName lastName' },
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

// get a member
const getMember = (req, res, next) => {
  return res.status(200).json({
    member: req.member,
  });
};

// member will be found on req.member
// const getMemberLoad = async (req, res, next) => {
//   try {
//     const member = await Team.findById(req.params.memberId)
//       .populate('account', 'name email firstName lastName')
//       .populate('company', 'name');

//     if (member) {
//       req.member = member;
//       return next();
//     } else {
//       return res.status(404).json({
//         message: 'No valid entry found for provided Member ID',
//       });
//     }
//   } catch (error) {
//     logger.error(`${error}`);
//     next(error);
//   }
// };

// 1st step: Find member list from company.
// 2nd step: Create a list of employee
// 3rd step: Exclude them from the Team Search
// cid = companyID
const searchTeamMember = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, pid } = req.query;
    const existingMembers = await Team.find({
      _id: pid,
      removed: false
    }).sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit)
      .select('account role')

    return sendJSONresponse(res, 200, existingMembers)

  } catch (error) {
    logger.error(`${error}`)
    next(error)
  }
  // try {
  //   const {
  //     limit = 50,
  //     skip = 0,
  //     name,
  //     companyID,
  //     holder,
  //   } = req.query;
  //   if (holder === 'projectOwner') {
  //     const company = await Company.findById({
  //       _id: companyID,
  //     }).populate('members', 'account');
  //     let memberListId = company.members;
  //     memberListId = memberListId.map(member => member.account);
  //     let data = await Account.find({
  //       $and: [
  //         { name: { $regex: new RegExp(name) } },
  //         { _id: { $nin: memberListId } },
  //       ],
  //     })
  //       .select('_id email name firstName lastName')
  //       .sort({ createdAt: -1 })
  //       .skip(+skip)
  //       .limit(+limit);
  //     // TODO: pore ami change korbo query onusaree
  //     return sendJSONresponse(res, 200, {
  //       employees: {
  //         message: `Search complete ${name}`,
  //         data,
  //       },
  //     });
  //   } else {
  //     return sendJSONresponse(res, 200, {
  //       employees: {
  //         message: `Search complete ${name}`,
  //         data,
  //       },
  //     });
  //   }
  // } catch (error) {
  //   logger.error(`${error}`);
  //   next(error);
  // }
};

module.exports = {
  addTeamMember,
  list,
  getMember,
  getMemberLoad,
  searchTeamMember,
  changeRole,
};
