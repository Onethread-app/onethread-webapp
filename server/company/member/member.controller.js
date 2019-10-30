const { Member } = require('./member.model');
const Account = require('../../account/account.model');
// const { Company } = require('../company.model');
const logger = require('../../../config/winston');
const { sendJSONresponse } = require('../../helpers/jsonResponse');
const {
  APIError,
  EmailIdExistError,
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

    let unique = members.map(m => {
      return m._id;
    });

    // save ref in company
    req.company.members.addToSet(...unique);
    await req.company.save();

    let response = members.map(
      ({ _id, account, role, designation }) => {
        return { _id, account, role, designation };
      },
    );

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

// const searchMember = async (req, res, next) => {
//   const name = req.query.name;
//   const companyList = Company.findById({
//     _id: req.company._id,
//   }).populate('members');
//   console.log(companyList);
//   const companyMember = req.company.members;
//   console.log(companyMember);
//   const memberListId = [
//     '5db7e3282660d43b5af93cd8',
//     '5db81f7930595402ee57a677',
//     '5db82102e80535065d90848e',
//     '5db81eb27edd8d0136d9d2f7',
//   ];
//   if (name === '') {
//     const err = new BadRequestError(
//       'Nothing Submitted',
//       httpStatus.BAD_REQUEST,
//       true,
//     );
//     logger.error(`Query Error: ${err}`);
//     return next(err);
//   }
//   Account.find({ name: { $regex: name, $nin: memberList } })
//     .select('_id email name')
//     .then(data => {
//       if (data.length < 1) {
//         const err = new SearchNotMatchError(
//           'Query does not found',
//           httpStatus.BAD_REQUEST,
//           true,
//         );
//         logger.error(`Query Error: ${err}`);
//         return next(err);
//       } else {
//         logger.info(`Search complete ${name}`);
//         return sendJSONresponse(res, 200, {
//           employees: {
//             success: true,
//             message: `Search complete ${name}`,
//             data,
//           },
//         });
//       }
//     })
//     .catch(err => {
//       return next(err);
//     });
// };

module.exports = {
  addMember,
  list,
  getMember,
  getMemberLoad,
  // searchMember,
};
