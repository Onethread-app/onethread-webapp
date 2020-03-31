const Account = require('../account/account.model');
const mongoose = require('mongoose');
const { Associate } = require('../associate/associate.model');
const { Company, Certificate } = require('./company.model');
const { Announcement } = require('./announcement.model');
const { Member } = require('./member/member.model');
const { chatkit } = require('../services/pusher.services');
const {
  sendCompanyNotification,
} = require('../services/notification.services');
const {
  createCompanyRoleNotification,
} = require('../notification/notification.controller');

const {
  search,
  setDocument,
  memberIndex,
  companyIndex,
} = require('../services/elastic.services');
const chalk = require('chalk');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const logger = require('../../config/winston');
const { Project } = require('../project/project.model');
// create a company profile
const changeName = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    // check member & role: superAdmin/admin
    const members = await Member.findOne({
      $or: [{ role: 'superAdmin' }, { role: 'admin' }],
      company: req.company._id,
    });

    //middleware added
    // if (!member || !['superAdmin', 'admin'].includes(member.role)) {
    //   return res.status(403).json({
    //     message: `Restricted`,
    //   });
    // }

    // check duplicate company name
    const duplicate = await Company.findOne({
      name: req.body.name,
    });
    if (duplicate) {
      return res.status(409).json({
        message: `Name already exist`,
      });
    }

    req.company.name = req.body.name;
    await req.company.save();

    //notification

    sendCompanyNotification(req.company._id, {
      _id: req.user._id,
      name: req.user.name,
    });

    const notification = new Notification({
      type: 'companyProfile',
      account: req.user._id,
      company: req.company._id,
    });

    // const userNotification = new UserNotification({
    //   notification: notification._id,
    //   company: req.company._id,
    // });
    let usersNotification = members.map(m => {
      return {
        notification: notification._id,
        account: m.account,
      };
    });

    await notification.save();
    await UserNotification.create(usersNotification);

    return res.status(200).json({
      message: `Company's name updated`,
    });
  } catch (error) {
    next(error);
  }
};

// create a company profile
const createCompany = async (req, res, next) => {
  // Check for JSON
  // if (!req.is('application/json')) {
  //   return res.send("Expects 'application/json'");
  // }

  try {
    // check duplicate company name
    const duplicate = await Company.findOne({
      name: req.body.name,
    });
    if (duplicate) {
      return res.status(409).json({
        message: `Duplicate company name`,
      });
    }

    req.body.account = req.user._id;
    const newCompany = new Company(req.body);

    // create a default room
    // const newRoom = new Room({
    //   name: 'General',
    //   company: newCompany._id,
    //   members: [req.user._id],
    //   account: req.user._id,
    // });

    // create a default member
    const newMember = new Member({
      account: req.user._id,
      company: newCompany._id,
      role: 'superAdmin',
    });

    // add ref[member,room] in company
    //newCompany.members.push(newMember._id);
    // newCompany.rooms.push(newRoom._id);

    // company creation
    const company = await newCompany.save();

    await setDocument(companyIndex, '_doc', {
      mongo_id: company._id,
      name: company.name,
    });

    logger.info(
      chalk.blueBright(
        `Elasticsearch document added on ${companyIndex}`,
      ),
    );
    // const room = await newRoom.save();
    // await chatkit.createRoom({
    //   id: room._id,
    //   creatorId: req.user._id,
    //   name: room.name,
    //   customData: {
    //     company: company._id,
    //   },
    // });
    const elasticMember = await newMember.save();

    const elasticMemberPopulated = await Member.findOne({
      _id: elasticMember._id,
    }).populate({
      path: 'account',
      select: '_id name firstName lastName email',
    });

    await setDocument(memberIndex, '_doc', {
      mongo_id: elasticMemberPopulated._id,
      account: elasticMemberPopulated.account,
      company: elasticMemberPopulated.company,
    });

    logger.info(
      chalk.blueBright(
        `Elasticsearch document added on ${memberIndex}`,
      ),
    );

    // // add company ref in user
    // req.user.companies.push(newCompany._id);
    // await req.user.save();

    return res.status(201).json({
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
    logger.error(`${error}`);
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
        select: '_id name logo',
      },
    ];

    let companies = await Member.find({
      account: req.params.account,
      removed: false,
    })
      .select('_id company role')
      .populate(options);

    return res.status(200).json({
      companies,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// get a company profile
const getCompany = async (req, res, next) => {
  try {
    // company details
    let company = await Company.findOne({
      name: req.params.cname,
    }).select(
      '-account -websites -members -rooms -products -departments -divisions -createdAt -updatedAt -__v',
    );

    // role info
    let member = await Member.findOne({
      account: req.user._id,
      company: company._id,
    }).select('-_id role');
    let certificate = await Certificate.find({
      company: company._id,
    }).select('-__v');
    let memberCount = await Member.find({
      company: company._id,
    }).countDocuments();
    return res.status(200).json({
      company: {
        ...company._doc,
        role: member.role,
        certificate: certificate,
        totalMember: memberCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// update a company basic info
const updateBasicInfo = async (req, res, next) => {
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

    await req.company.save();

    const text = `company profile has been updated by ${req.user.name}`;
    createCompanyRoleNotification(
      req.company,
      { _id: req.user._id, name: req.user.name },
      text,
      'companyProfile',
    );
    //createCompanyNotification(req.company._id, {_id:req.user._id, name: req.user.name} );
    return res.status(200).json({
      message: `Company's basic information updated`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// update a company basic info
const updateAbout = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    req.company.about = req.body.about;

    await Company.findOneAndUpdate(
      { _id: req.company._id },
      { about: req.body.about },
      { safe: true, upsert: true, new: true },
    ).exec();

    const text = `company profile has been updated by ${req.user.name}`;
    createCompanyRoleNotification(
      req.company,
      { _id: req.user._id, name: req.user.name },
      text,
      'companyProfile',
    );
    //sendCompanyNotification(req.company._id, {_id:req.user._id, name: req.user.name});
    //createCompanyNotification(req.company._id , {_id:req.user._id, name: req.user.name} );

    return res.status(200).json({
      message: `Company's about updated`,
    });
  } catch (error) {
    next(error);
  }
};

// update a company role
const updateRole = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    //Company.deleteMany({}, function(err, result) {

    //});
    //req.company.optionalRole = req.body.optionalRole;
    const company = await Company.findOneAndUpdate(
      { _id: req.company._id },
      { $set: { optionalRole: req.body.optionalRole } },
      {
        safe: true,
        upsert: true,
      },
    ).exec();

    //await req.company.save();

    return res.status(200).json({
      message: `Company's role updated`,
      data: company.optionalRole,
    });
  } catch (error) {
    next(error);
  }
};

// company will be found on req.company
const getCompanyLoad = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      _id: req.params.companyId,
    }).populate('account', '_id firstName lastName email contactNo');

    if (company) {
      req.company = company;
      return next();
    } else {
      return res.status(404).json({
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
              message: 'Company deleted',
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(404);
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

const authorizeUser = (functionalRole, ...userRoles) => {
  return async function(req, res, next) {
    // console.log(functionalRole)
    // console.log(req)
    // console.log(...userRoles)
    try {
      // const company =  await Company.findOne({
      //   _id: req.params.companyId,
      // }).select('_id optionalRole').exec();

      const member = await Member.findOne({
        account: req.user._id,
        company: req.params.companyId, //apatoto pore name or id hobe
      }).exec();

      // if (
      //   !member ||
      //   !userRoles.includes(member.role) ||
      //   !company.optionalRole.includes(functionalRole)
      // )
      if (
        !member ||
        (functionalRole === 'all' && !userRoles.includes(member.role))
      ) {
        return res.status(403).json({
          message: `Restricted`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const searchCompany = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, name, companyId } = req.query;
    const associate = await Associate.find({
      $or: [{ company: companyId }, { associateCompany: companyId }],
      isRejected: false,
    }).exec();

    let associateCompanyId = associate.map(m => {
      if (m.company.toString() === companyId) {
        return m.associateCompany;
      }
      return m.company;
    });
    associateCompanyId.push(companyId);

    if (name) {
      let body = {
        size: 200,
        from: 0,
        query: {
          bool: {
            must: [
              {
                match_phrase_prefix: {
                  name: name,
                },
              },
            ],
            must_not: [
              {
                terms: {
                  mongo_id: associateCompanyId,
                },
              },
            ],
          },
        },
      };

      const response = await search(companyIndex, '_doc', body);

      return sendJSONresponse(res, 200, {
        success: true,
        message: `Search complete for ${name}`,
        data: response.hits.hits,
      });
    } else {
      return sendErrorResponse(res, 400, 'EmptySearchError', {
        message: `query error`,
      });
    }

    // await Company.find({
    //   name: { $regex: new RegExp(name), $options: 'i' },
    //   _id: { $nin: associateCompanyId },
    // })
    //   .select('name')
    //   .skip(+skip)
    //   .limit(+limit)
    //   .then(data => {
    //     return sendJSONresponse(res, 200, {
    //       success: true,
    //       message: `Search complete for ${name}`,
    //       data,
    //     });
    //   });
  } catch (error) {
    next(error);
  }
};

const addCertifications = async (req, res, next) => {
  try {
    const certificate = new Certificate({
      name: req.body.name,
      description: req.body.description,
      company: req.params.companyId,
    });
    await certificate.save();
    return sendJSONresponse(res, 201, {
      message: 'Certification add',
    });
  } catch (error) {
    next(error);
  }
};

const parentOrg = async (req, res, next) => {
  try {
    const parentCom = req.body.parentcom;
    let user = await Company.findByIdAndUpdate(
      {
        _id: req.params.companyId,
      },
      {
        $push: { parentcom: parentCom },
      },
      {
        new: true,
        safe: true,
        upsert: true,
      },
    );
    //  await Company.findOneAndUpdate({_id: req.params.companyId}, {$push:{parentcom: parentCom._id}},{safe: true, new: true, upsert: true})
    return sendJSONresponse(res, 200, {
      success: true,
      message: `parentOrg updated`,
    });
  } catch (error) {
    next(error);
  }
};

const dashBoard = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const totalProject = await Project.find({
      company: companyId,
    }).countDocuments();
    const totalEmployee = await Member.find({
      company: companyId,
    }).countDocuments();
    const totalAssociates = await Associate.find({
      $or: [{ company: companyId }, { associateCompany: companyId }],
      isAccepted: true,
      removed: false,
      isRejected: false,
    }).countDocuments();

    return sendJSONresponse(res, 200, {
      success: true,
      data: {
        totalProject,
        totalEmployee,
        totalAssociates,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const noticePostByCompany = async (req, res, next) => {
  try {
    const NewNotice = req.body.announcement;
    const announcement = new Announcement({
      text: NewNotice,
      company: req.params.companyId,
    });
    logger.info(`new notice created`);
    await announcement.save();
    const text = ` ${req.user.name} has created a announcment in ${req.user.name} company `;
    createCompanyRoleNotification(
      { _id: req.params.companyId },
      { _id: req.user._id, name: req.user.name },
      text,
      'announcement',
    );
    return sendJSONresponse(res, 201, {
      message: 'New notice added',
      announcement,
    });
  } catch (error) {
    console.log(error);
    logger.error(`${error}`);
    next(error);
  }
};

const allNoticesForCompany = async (req, res, next) => {
  try {
    const announce = await Announcement.find({
      company: req.params.companyId,
    });

    logger.info(`announcement show for company`);
    return sendJSONresponse(res, 200, {
      announce,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};
module.exports = {
  authorizeUser,
  createCompany,
  getCompany,
  updateBasicInfo,
  updateRole,
  updateAbout,
  getCompanyIndividual,
  changeName,
  deleteCompany,
  getCompanyLoad,
  searchCompany,
  parentOrg,
  addCertifications,
  dashBoard,
  noticePostByCompany,
  allNoticesForCompany,
};
