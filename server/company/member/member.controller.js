const Account = require('../../account/account.model');
const { Member } = require('./member.model');
const { Company } = require('../company.model');
const { Room } = require('./../../room/room.model');
const { chatkit } = require('../../services/pusher.services');
const logger = require('../../../config/winston');
const { sendJSONresponse } = require('../../helpers/jsonResponse');
const client = require('../../../index.elasticsearch');

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
    const members = await Member.create(req.body.members);
    if (!members.length) {
      return res.status(400).json({
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
      message: 'New member created',
      members,
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
    const name = req.query.name;
    const companyID = req.company._id;
    const company = await Company.findById({
      _id: companyID,
    }).populate('members', 'account');
    let memberListId = company.members;
    memberListId = memberListId.map(member => member.account);

    if(name){


      let body = {
        size: 200,
        from: 0,
        query: {
          bool:{
            must: [
              {
                match: {
                  "email": req.query.name
                }
              }
            ],
            must_not: [
              {
                "terms" : {
                  "mongo_id": memberListId 
                }
              }
            ]
          }
        }
      }

      client
        .search({ index: 'accounts' , body: body , type: 'doc'})
        .then(response =>{
          return sendJSONresponse(res, 200 , {
            success: true,
            message: `Search complete for ${name}`,
            data: response.hits.hits
          })
        })
        .catch(err => {
          console.log(err);
        })
    }else{
      return sendErrorResponse(res, 400, 'EmptySearchError', {
        message: `query error`,
      });
    }
  }
  catch (error) {
        logger.error(`${error}`);
        next(error);
      }








  //   let data = await Account.find({
  //     $and: [
  //       { name: { $regex: new RegExp(name) } },
  //       { _id: { $nin: memberListId } },
  //     ],
  //   }).select('_id email name firstName lastName');
  //   // TODO: pore ami change korbo query onusaree
  //   return sendJSONresponse(res, 200, {
  //     employees: {
  //       message: `Search complete ${name}`,
  //       data,
  //     },
  //   });
  // } catch (error) {
  //   logger.error(`${error}`);
  //   next(error);
  // }
};

module.exports = {
  addMember,
  list,
  getMember,
  getMemberLoad,
  searchMember,
  changeRole,
};
