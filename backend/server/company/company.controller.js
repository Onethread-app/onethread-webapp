const Account = require('../account/account.model');
const { Associate } = require('../associate/associate.model');
const { Company, Certificate } = require('./company.model');
const { Announcement } = require('./announcement.model');
const { Member } = require('./member/member.model');
const Plan = require('../plan/plan.model');
const { createSlug } = require('../helpers/SlugCreator');
const Task = require('../task/task.model');
const Boardcolumn = require('../boardColumn/boardColumn.model');
const {
  triggerNotification,
} = require('../services/webpush.services');

const {
  Subscription,
} = require('../subscription/subscription.model');

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
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    // check member & role: superAdmin/admin
    const members = await Member.findOne({
      $or: [{ role: 'superAdmin' }, { role: 'admin' }],
      company: req.company._id,
    });
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
    req.company.uniqueName = createSlug(req.body.name);
    const company = await req.company.save();

    //notification

    // const text = `company name has been updated by ${req.user.name}`;
    // createCompanyRoleNotification(
    //   req.company,
    //   {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     pusherSock: req.headers.clientid,
    //   },
    //   text,
    //   'companyProfile',
    // );
    return sendJSONresponse(res, 200, {
      message: `Company's name updated`,
      company: {
        _id: company._id,
        name: company.name,
        uniqueName: company.uniqueName,
        type: company.type,
        email: company.email,
        address: company.address,
        legalOwnerName: company.legalOwnerName,
        legalOwnerMail: company.legalOwnerMail,
        role: 'superAdmin',
      },
    });
  } catch (error) {
    logger.error(`Company: ${error}`);
    next(error);
  }
};

// create a company profile
const createCompany = async (req, res, next) => {
  try {
    req.body.account = req.user._id;
    const duplicate = await Company.findOne({
      name: req.body.name,
    });
    if (duplicate) {
      return sendErrorResponse(res, 409, 'DuplicateNameError', {
        message: 'Name already exist',
      });
    }
    req.body.uniqueName = createSlug(req.body.name);
    const newCompany = new Company(req.body);

    const planId = await Plan.findOne({ name: 'trial' });
    if (!planId) {
      return sendErrorResponse(res, 404, 'PlanNotFoundError', {
        message: 'Plan is not created',
      });
    }
    await Subscription.create({
      company: newCompany._id,
      plan: planId._id,
      expireAt: new Date().getTime() + 86400000 * planId.validity,
      isActive: true,
    });
    logger.info(
      `Subscription: Subscription create for company ${req.body.name}`,
    );
    // create a default member
    const newMember = new Member({
      account: req.user._id,
      company: newCompany._id,
      role: 'superAdmin',
    });

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

    return sendJSONresponse(res, 201, {
      message: 'New company created',
      company: {
        _id: company._id,
        name: company.name,
        uniqueName: company.uniqueName,
        type: company.type,
        email: company.email,
        address: company.address,
        legalOwnerName: company.legalOwnerName,
        legalOwnerMail: company.legalOwnerMail,
        role: 'superAdmin',
      },
    });
  } catch (error) {
    logger.error(`Company: ${error}`);
    next(error);
  }
};

// get companies list for individual user
const getCompanyIndividual = async (req, res, next) => {
  try {
    // populate options
    let options = [
      {
        path: 'company',
        select: '_id name uniqueName logo',
      },
    ];

    let companies = await Member.find({
      account: req.params.account,
      removed: false,
    })
      .select('_id company role')
      .populate(options);

    return sendJSONresponse(res, 200, {
      companies,
    });
  } catch (error) {
    logger.error(`Company: ${error}`);
    next(error);
  }
};

// get a company profile
const getCompany = async (req, res, next) => {
  try {
    // company details
    let company = await Company.findOne({
      uniqueName: req.params.cname,
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

    return sendJSONresponse(res, 200, {
      company: {
        ...company._doc,
        role: member.role,
        certificate: certificate,
        totalMember: memberCount,
      },
    });
  } catch (error) {
    logger.error(`Company: ${error}`);
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

    // const text = `company profile has been updated by ${req.user.name}`;
    // createCompanyRoleNotification(
    //   req.company,
    //   {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     pusherSock: req.headers.clientid,
    //   },
    //   text,
    //   'companyProfile',
    // );
    //createCompanyNotification(req.company._id, {_id:req.user._id, name: req.user.name} );
    return res.status(200).json({
      message: `Company's basic information updated`,
    });
  } catch (error) {
    logger.error(`${error}`);
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

    // const text = `company profile has been updated by ${req.user.name}`;
    // createCompanyRoleNotification(
    //   req.company,
    //   {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     pusherSock: req.headers.clientid,
    //   },
    //   text,
    //   'companyProfile',
    // );
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
    .then((result) => {
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
          .then((data) => {
            res.status(200).json({
              message: 'Company deleted',
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(404);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const authorizeUser = (functionalRole, ...userRoles) => {
  return async function (req, res, next) {
    try {
      const member = await Member.findOne({
        account: req.user._id,
        company: req.headers.companyid || req.params.companyId, //apatoto pore name or id hobe
      }).exec();
      if (
        !member ||
        (functionalRole === 'all' && !userRoles.includes(member.role))
      ) {
        return sendErrorResponse(res, 403, 'PermissionError', {
          message: `Restricted`,
        });
      }

      next();
    } catch (error) {
      logger.error(`Company: ${error}`);
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

    let associateCompanyId = associate.map((m) => {
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
  } catch (error) {
    logger.error(`Company: ${error}`);
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
      certificate,
    });
  } catch (error) {
    logger.error(`Company: ${error}`);
    next(error);
  }
};

const editCertification = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.query.certificateId,
    });

    if (!certificate) {
      return sendErrorResponse(
        res,
        404,
        'CertificateIdNotFoundError',
        {
          message: `certificateId not found`,
        },
      );
    } else {
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          certificate[key] = req.body[key];
        }
      }

      const editedCertificate = await certificate.save();

      return sendJSONresponse(res, 200, {
        message: 'Certification edited',
        data: editedCertificate,
      });
    }
  } catch (error) {
    logger.error(`Company: ${error}`);
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
        $set: { parentcom: parentCom },
      },
      {
        new: true,
        safe: true,
        upsert: true,
      },
    ).select('parentcom');
    return sendJSONresponse(res, 200, {
      success: true,
      message: `parentOrg updated`,
      data: user,
    });
  } catch (error) {
    logger.error(`Compnay: ${error}`);
    next(error);
  }
};

const dashBoard = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const totalProject = await Project.find({
      $or: [{ company: companyId }, { associate: companyId }],
      removed: false,
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
    let projectCompilation = [];
    let projectList = await Project.find({
      $or: [{ company: companyId }, { associate: companyId }],
      removed: false,
    }).select('_id name');
    let i;
    for (i = 0; i < projectList.length; i++) {
      let projectName = projectList[i].name;
      const taskNumbers = await Task.find({
        project: { $in: projectList[i]._id },
      }).countDocuments();
      const doneTask = await Task.find({
        $and: [
          { project: { $in: projectList[i]._id }, status: 'done' },
        ],
      }).countDocuments();
      let projectObj = {};
      projectObj.name = projectName;
      projectObj.taskNumbers = taskNumbers;
      projectObj.doneTask = doneTask;
      projectCompilation.push(projectObj);
    }
    return sendJSONresponse(res, 200, {
      success: true,
      data: {
        totalProject,
        totalEmployee,
        totalAssociates,
        projectCompilation,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const latestCompletedTasks = async (req, res, next) => {
  try {
    const companyId = req.headers.companyid;
    let projectList = await Project.find({
      $or: [{ company: companyId }, { associate: companyId }],
      removed: false,
    }).select('name');
    let completedTaskCompilation = [];
    for (let i = 0; i < projectList.length; i++) {
      const doneTask = await Task.find({
        $and: [
          {
            project: { $in: projectList[i]._id },
            status: 'done',
          },
        ],
      })
        .select('name updatedAt')
        .populate('boardId project', 'name name')
        .exec();
      completedTaskCompilation.push(doneTask);
    }
    let organizedTask = [];
    completedTaskCompilation.map((cTask) => {
      cTask.map((task) => {
        organizedTask.push(task);
      });
    });
    return sendJSONresponse(res, 200, {
      success: true,
      data: organizedTask,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const noticePostByCompany = async (req, res, next) => {
  try {
    const noticeText = req.body.text;
    const companyId = req.params.companyId;
    const currentUserId = req.user._id;

    const memberId = await Member.findOne({
      account: currentUserId,
      company: companyId,
    });

    const announcement = new Announcement({
      memberId,
      text: noticeText,
      company: companyId,
    });

    const options = [
      {
        path: 'memberId',
        select: 'designations',
        populate: 'designations',
      },
    ];

    logger.info(`new notice created`);
    const newAnnouncement = await announcement.save();
    await Announcement.populate(newAnnouncement, options);
    // const text = ` ${req.user.name} has created a announcement in ${req.company.name} company `;
    // createCompanyRoleNotification(
    //   { _id: req.params.companyId },
    //   {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     pusherSock: req.headers.clientid,
    //   },
    //   text,
    //   'announcement',
    // );
    return sendJSONresponse(res, 201, {
      message: 'New notice added',
      newAnnouncement,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const allNoticesForCompany = async (req, res, next) => {
  try {
    const options = [
      {
        path: 'memberId',
        select: 'designations account role',
        populate: [
          {
            path: 'account',
            select: '_id firstName lastName',
          },
          {
            path: 'designations',
            select: 'division department position',
          },
        ],
      },
    ];

    const announce = await Announcement.find({
      company: req.params.companyId,
    })
      .select('_id memberId text createdAt memberId')
      .populate(options)
      .sort({ createdAt: 'desc' });

    logger.info(`announcement show for company`);
    return sendJSONresponse(res, 200, {
      announce,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const adminSuperAdminFinder = async (req, res, next) => {
  try {
    const companyList = await Member.find({
      account: req.user._id,
      role: { $in: ['superAdmin', 'admin'] },
    }).populate('company', '_id name');
    return sendJSONresponse(res, 200, companyList);
  } catch (error) {
    logger.error(`Company: ${error}`);
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
  latestCompletedTasks,
  noticePostByCompany,
  allNoticesForCompany,
  adminSuperAdminFinder,
  editCertification,
};
