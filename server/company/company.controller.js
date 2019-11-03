const Account = require('../account/account.model');
const { Company } = require('./company.model');
const { Member } = require('./member/member.model');
const { Room } = require('./../room/room.model');
const { chatkit } = require('../services/pusher.services');

// create a company profile
const createCompany = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    // check duplicate company name
    const duplicate = await Company.findOne({
      name: req.body.name,
    });
    if (duplicate) {
      return res.status(409).json({
        status: false,
        message: `Duplicate company name`,
      });
    }

    req.body.account = req.user._id;
    const newCompany = new Company(req.body);

    // create a default room
    const newRoom = new Room({
      name: 'General',
      company: newCompany._id,
      members: [req.user._id],
      account: req.user._id,
    });

    // create a default member
    const newMember = new Member({
      account: req.user._id,
      company: newCompany._id,
      role: 'superAdmin',
    });

    // add ref[member,room] in company
    newCompany.members.push(newMember._id);
    newCompany.rooms.push(newRoom._id);

    // company creation
    const company = await newCompany.save();
    const room = await newRoom.save();
    await chatkit.createRoom({
      id: room._id,
      creatorId: req.user._id,
      name: room.name,
      customData: {
        company: company._id,
      },
    });
    await newMember.save();

    // add company ref in user
    req.user.companies.push(newCompany._id);
    await req.user.save();

    return res.status(201).json({
      status: true,
      message: 'New company created',
      company: {
        _id: company._id,
        name: company.name,
        type: company.type,
        email: company.email,
        address: company.address,
        legalOwnerName: company.legalOwnerName,
        legalOwnerMail: company.legalOwnerMail,
        role: 'superAdmin',
      },
    });
  } catch (error) {
    return next(error);
  }
};

// get companies list for individual user
const getCompanyIndividual = async (req, res, next) => {
  try {
    // populate options
    let options = [
      {
        path: 'company',
        select: '_id name',
      },
    ];

    let companies = await Member.find({
      account: req.params.account,
    })
      .select('-_id company role')
      .populate(options);

    return res.status(200).json({
      status: true,
      companies,
    });
  } catch (error) {
    next(error);
  }
};

// get a company profile
const getCompany = async (req, res, next) => {
  try {
    // populate options
    let options = [
      // {
      //   path: 'members',
      //   select: '_id account role designations',
      //   populate: [{ path: 'account', select: '_id name' }],
      // },
    ];

    // company details
    let company = await Company.findOne({
      name: req.params.cname,
    })
      .select(
        '-account -websites -rooms -products -members -departments -divisions -createdAt -updatedAt -__v',
      )
      .populate(options);

    // role info
    let member = await Member.findOne({
      account: req.user._id,
      company: req.company._id,
    }).select('-_id role');

    return res.status(200).json({
      status: true,
      company: { ...company._doc, role: member.role },
    });
  } catch (error) {
    next(error);
  }
};

// update a company profile
const updateCompany = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    // updating new values
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.company[key] = req.body[key];
      }
    }

    let company = await req.company.save();

    return res.status(200).json({
      status: true,
      message: 'Company updated',
      company,
    });
  } catch (error) {
    next(error);
  }
};

// company will be found on req.company
const getCompanyLoad = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      name: req.params.cname,
    }).populate('account', '_id firstName lastName email contactNo');

    if (company) {
      req.company = company;
      return next();
    } else {
      return res.status(404).json({
        status: false,
        message: 'No valid entry found for provided Company Name',
      });
    }
  } catch (error) {
    next(error);
  }
};

// TODO: will be soft delete before production
const deleteCompany = async (req, res, next) => {
  Company.findByIdAndRemove({ _id: req.params.id })
    .exec()
    .then(result => {
      if (result) {
        //Store this company's ref into Account
        Account.findOneAndUpdate(
          { _id: req.user._id },
          { $pull: { companies: req.params.id } },
          {
            safe: true,
            upsert: true,
          },
        )
          .exec()
          .then(data => {
            res.status(200).json({
              status: true,
              message: 'Company deleted',
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res
          .status(404)
          .json({ status: false, message: 'No company found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// TODO: will be work on member controller
const addEmployees = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  // TODO: some minor checking
  Company.update(
    { name: req.params.cname },
    {
      $addToSet: {
        employees: { $each: req.body.employees },
      },
    },
  )
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          status: true,
          message: 'New employees added',
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: 'No company found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  createCompany,
  getCompany,
  updateCompany,
  getCompanyIndividual,
  deleteCompany,
  addEmployees,
  getCompanyLoad,
};
