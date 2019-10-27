const { Member } = require('./member.model');
const Account = require('../../account/account.model');
const Division = require('../division/division.model');
const Department = require('../department/department.model');

// add team member
const addMember = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    // check user already exists with same company
    const duplicate = await Member.findOne({
      account: req.body.account,
      company: req.company._id,
    });

    if (duplicate) {
      return res.status(409).json({
        status: false,
        message: `User already exists`,
      });
    }

    // check user exists or not
    const account = await Account.findOne({ _id: req.body.account });
    if (!account) {
      return res.status(404).json({
        status: false,
        message: 'No valid account found for provided ACCOUNT-ID',
      });
    }

    // check division exists or not
    const division = await Division.findOne({
      _id: req.body.division,
    });
    if (!division) {
      return res.status(404).json({
        status: false,
        message: 'No valid division found for provided DIVISION-ID',
      });
    }

    // check department exists or not
    const department = await Department.findOne({
      _id: req.body.department,
    });
    if (!department) {
      return res.status(404).json({
        status: false,
        message:
          'No valid department found for provided DEPARTMENT-ID',
      });
    }

    // member creation
    req.body.company = req.company._id;
    const newMember = new Member(req.body);
    const member = await newMember.save();

    // save ref in company
    req.company.members.push(member._id);
    await req.company.save();

    return res.status(201).json({
      status: true,
      message: 'New member created',
      member,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

// get all members for a company
const list = async (req, res) => {
  try {
    const members = await Member.find({
      company: req.company._id,
    })
      .select('-__v -company')
      .populate([
        { path: 'department', select: '_id name' },
        { path: 'division', select: '_id name' },
        { path: 'account', select: '_id name' },
      ]);
    if (members.length) {
      return res.status(200).json({
        status: true,
        members,
      });
    }
    return res.status(404).json({
      status: false,
      message: 'No members found.',
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

// get a member
const getMember = (req, res) => {
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
    return res.status(500).json({
      error: error,
    });
  }
};

module.exports = {
  addMember,
  list,
  getMember,
  getMemberLoad,
};
