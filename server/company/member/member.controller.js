const { Member } = require('./member.model');
const Account = require('../../account/account.model');

// add team member
const addMember = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    const duplicate = await Member.findOne({
      account: req.body.account,
      company: req.company._id,
    });

    // check user already exists with same company
    if (duplicate) {
      return res.status(409).json({
        status: false,
        message: `User already exists`,
      });
    }

    const account = await Account.findOne({ _id: req.body.account });

    // check user exists or not
    if (!account) {
      return res.status(404).json({
        status: false,
        message: 'No valid account found for provided ACCOUNT-ID',
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
  getMember,
  getMemberLoad,
};
