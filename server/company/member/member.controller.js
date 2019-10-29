const { Member } = require('./member.model');
const Account = require('../../account/account.model');
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

const searchMember = async (req, res, next) => {
  const name = req.query.name;
  const memberList = [
    '5db81f45f2bfce027c6eb8f4',
    '5db7e3282660d43b5af93cd8',
  ];
  if (name === '') {
    const err = new BadRequestError(
      'Nothing Submitted',
      httpStatus.BAD_REQUEST,
      true,
    );
    logger.error(`Query Error: ${err}`);
    return next(err);
  }
  Account.find({ name: { $nin: memberList } })
    .select('email name _id')
    .then(data => {
      if (data.length < 1) {
        const err = new SearchNotMatchError(
          'Query does not found',
          httpStatus.BAD_REQUEST,
          true,
        );
        logger.error(`Query Error: ${err}`);
        return next(err);
      } else {
        logger.info(`Search complete ${name}`);
        return sendJSONresponse(res, 200, {
          employees: {
            success: true,
            message: `Search complete ${name}`,
            data,
          },
        });
      }
    })
    .catch(() => {
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
