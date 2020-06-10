const { Member } = require('../company/member/member.model');
const { Project } = require('./project.model');
const { ProjectRequest } = require('../request/request.model');
const { Associate } = require('../associate/associate.model');
const { Team } = require('../team-member/team.model');
const File = require('../file/file.model');
const logger = require('../../config/winston');
const {
  search,
  memberIndex,
  associateIndex,
} = require('../services/elastic.services');
const {
  sendErrorResponse,
  sendJSONresponse,
} = require('../helpers/jsonResponse');
const {
  createCompanyRoleNotification,
} = require('../notification/notification.controller');
const teamCreate = async (account, member, project, role) => {
  let newTeam = new Team({
    account,
    member,
    project,
    role,
  });
  await newTeam.save();
};

const projectRequestUpdate = async (pid, size) => {
  await ProjectRequest.updateOne(
    { project: pid },
    {
      $set: {
        isAccepted: true,
        isRejected: false,
        size: size,
      },
    },
    { safe: true, new: true, upsert: true },
  );
};

const createNewProjectForCompany = async (req, res, next) => {
  try {
    let associates = req.body.associates;
    let concernedAdmin = req.body.concernedAdmin;

    const member = await Member.findOne({
      account: req.user._id,
    });

    if (!member) {
      return sendErrorResponse(res, 404, 'MemberNotFoundError', {
        message: 'You are not added in company',
      });
    }

    if (req.body.type === 'associates') {
      const project = new Project({
        name: req.body.name,
        type: req.body.type,
        concernedAdmin: concernedAdmin.accountId,
        account: req.user._id,
        departments: req.body.departments,
        color: req.body.color,
        company: req.params.companyId,
        description: '',
        outline: '',
      });
      await project.save();
      let projectReq = [];
      // create an id of map array
      associates.map(async (data) => {
        let reqObject = {};
        reqObject.company = req.params.companyId;
        reqObject.associate = data._id;
        reqObject.account = req.user._id;
        reqObject.isAccepted = false;
        reqObject.project = project._id;
        reqObject.size = data.size;
        projectReq.push(reqObject);
        return reqObject;
      });
      await ProjectRequest.create(projectReq);
      let associateId = [];
      associateId = associates.map((data) => {
        return data._id;
      });
      // // Insert project request
      associateId.forEach(async (data) => {
        let associate = await Associate.findOne({
          $or: [
            {
              company: data,
              associateCompany: { $in: data },
            },
            { isAccepted: true, isRejected: false },
          ],
        })
          .populate('associateCompany', '_id name type')
          .populate('company', '_id name type')
          .exec();

        const text = `${associate.company.name} wants to create a associate project ${project.name} with your ${associate.associateCompany.name} `;
        createCompanyRoleNotification(
          associate.company._id,
          {
            _id: req.user._id,
            name: req.user.name,
            pusherSock: req.headers.clientid,
          },
          text,
          'project',
        );
      });
      logger.info(
        `${req.params.companyId} company send a project request to its associate`,
      );

      // build a team for this project
      if (req.user._id === concernedAdmin.accountId) {
        teamCreate(
          concernedAdmin.accountId,
          concernedAdmin.memberId,
          project._id,
          'admin',
        );
        logger.info(`project creator is the admin`);
      } else {
        teamCreate(member.account, member._id, project._id, 'admin');
        logger.info(`project creator add as a member here`);
        teamCreate(
          concernedAdmin.accountId,
          concernedAdmin.memberId,
          project._id,
          'admin',
        );
        logger.info(`concern admin add as an admin here`);
      }
      return sendJSONresponse(res, 201, {
        success: true,
        message: 'New project created for associate',
        project,
      });
    } else {
      const project = new Project({
        name: req.body.name,
        type: req.body.type,
        concernedAdmin: concernedAdmin.accountId,
        account: req.user._id,
        departments: req.body.departments,
        color: req.body.color,
        company: req.body.companyId,
        description: '',
        outline: '',
      });

      const text = `${req.user.name} has created a project ${project.name} `;
      createCompanyRoleNotification(
        { _id: req.body.companyId },
        {
          _id: req.user._id,
          name: req.user.name,
          pusherSock: req.headers.clientid,
        },
        text,
        'project',
      );

      await project
        .save()
        .then((project) => {
          logger.info(`new project created`);
          if (req.user._id === concernedAdmin.accountId) {
            teamCreate(
              concernedAdmin.accountId,
              concernedAdmin.memberId,
              project._id,
              'admin',
            );
            logger.info(`project creator add as a admin here`);
          } else {
            teamCreate(
              member.account,
              member._id,
              project._id,
              'admin',
            );
            teamCreate(
              concernedAdmin.accountId,
              concernedAdmin.memberId,
              project._id,
              'admin',
            );
            logger.info(
              `${concernedAdmin.accountId} & ${member.account} admin here`,
            );
          }
          return sendJSONresponse(res, 201, {
            success: true,
            message: 'New project created',
            project,
          });
        })
        .catch((error) => {
          logger.error(`Project: ${error}`);
          next(error);
        });
    }
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const createNewProjectFromHome = async (req, res, next) => {
  try {
    const memberId = await Member.findOne({
      account: req.user._id,
      company: req.params.companyId,
    }).select('role account');
    if (memberId.role === 'admin' || memberId.role === 'superAdmin') {
      const project = new Project({
        name: req.body.name,
        concernedAdmin: req.user._id,
        account: req.user._id,
        company: req.params.companyId,
        description: '',
        outline: '',
      });
      await project.save();
      logger.info(`project create for ${req.params.companyId}`);

      teamCreate(
        memberId.account,
        memberId._id,
        project._id,
        'admin',
      );
      logger.info(`${memberId.account} admin here`);
      return sendJSONresponse(res, 201, project);
    } else {
      return sendErrorResponse(res, 403, 'PermissionError', {
        message: `You are not authorized to create project`,
      });
    }
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};
// add associate in a project
const addAssociateInProject = async (req, res, next) => {
  try {
    let associates = req.body.associates;
    let projectReq = [];
    let associateId = [];
    associateId = associates.map((data) => {
      return data._id;
    });
    const pid = req.query.pid;
    let project = await Project.findByIdAndUpdate(
      { _id: pid },
      {
        $addToSet: {
          associate: associateId,
        },
      },
      { safe: true, upsert: true, new: true },
    );

    associates.map(async (data) => {
      let reqObject = {};
      reqObject.company = req.params.companyId;
      reqObject.account = req.user._id;
      reqObject.associate = data._id;
      reqObject.isAccepted = false;
      reqObject.project = project._id;
      reqObject.size = data.size;
      projectReq.push(reqObject);
      return reqObject;
    });
    await ProjectRequest.create(projectReq);
    logger.info(`project request send to the associates`);
    associateId.forEach(async (data) => {
      let associate = await Associate.findOne({
        $or: [
          {
            company: data,
            associateCompany: { $in: data },
          },
          { isAccepted: true, isRejected: false },
        ],
      })
        .populate('associateCompany', '_id name type')
        .populate('company', '_id name type')
        .exec();
      logger.info(`associates add into the project`);

      const text = `${associate.company.name} wants to collaborate ${project.name} with your ${associate.associateCompany.name} `;
      createCompanyRoleNotification(
        associate.company._id,
        {
          _id: req.user._id,
          name: req.user.name,
          pusherSock: req.headers.clientid,
        },
        text,
        'project',
      );
    });
    return sendJSONresponse(res, 200, {
      message: 'associate list update',
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

// update a company role
const updateRole = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return sendErrorResponse(res, 406, 'ContentTypeError', {
      message: "Expects 'application/json'",
    });
  }

  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.query.pid },
      { $set: { optionalRole: req.body.optionalRole } },
      {
        safe: true,
        upsert: true,
      },
    ).exec();

    //await req.company.save();
    return sendJSONresponse(res, 200, {
      message: `Project's role updated`,
      data: project.optionalRole,
    });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};
const projectPendingRequest = async (req, res, next) => {
  const { limit = 10, skip = 0 } = req.query;
  const companyId = req.params.companyId;
  const associateId = await Associate.findOne({
    $or: [{ company: companyId }, { associateCompany: companyId }],
  });
  await ProjectRequest.find({
    $and: [
      {
        company: { $nin: { _id: companyId } },
        associate: associateId,
        isAccepted: false,
        isRejected: true,
      },
    ],
  })
    .select('company project associate size')
    .populate('company project')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      logger.info(`pending project list for company:${companyId}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch((e) => {
      logger.error(`Project: ${e}`);
      next(e);
    });
};

const acceptProjectRequest = async (req, res, next) => {
  try {
    const pid = req.query.pid;
    const associate = req.body.associate;
    const companyId = req.params.companyId;
    const teamSize = req.body.size;
    await Associate.findOneAndUpdate(
      {
        $or: [
          { company: companyId },
          { associateCompany: { $in: { _id: companyId } } },
        ],
      },
      {
        $push: { project: pid },
      },
      { new: true, upsert: true },
    );
    let asso = await Associate.findOne({
      $or: [
        { company: req.params.companyId },
        { associateCompany: { $in: { _id: req.params.companyId } } },
      ],
    }).populate('associateCompany', '_id name type');
    const text = `${asso.company.name} has accepted request `;
    createCompanyRoleNotification(
      asso.company._id,
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
      text,
      'project',
    );
    // console.log(asso);
    await Project.updateOne(
      { _id: pid },
      {
        $push: { associate: associate },
      },
      { new: true, upsert: true },
    );
    const memberId = await Member.findOne({
      $and: [
        {
          company: req.params.companyId,
          account: req.user._id,
        },
      ],
    }).select('_id account role');
    if (memberId.role === 'superAdmin') {
      teamCreate(memberId.account, memberId._id, pid, 'member');
      logger.info(
        `Associate superAdmin join as team member in the project`,
      );
      projectRequestUpdate(pid, teamSize - 1);
      logger.info(`project request accept for ${pid}`);
    }
    if (memberId.role === 'Admin') {
      const isSuperAdmin = await Member.findOne({
        $and: [
          {
            company: req.params.companyId,
            role: 'superAdmin',
          },
        ],
      }).select('_id account');
      teamCreate(
        isSuperAdmin.account,
        isSuperAdmin._id,
        pid,
        'member',
      );
      logger.info(
        `Associate superAdmin join as team member in the project`,
      );
      teamCreate(isAdmin.account, isAdmin._id, pid, 'member');
      logger.info(
        `Associate admin join as team member in the project`,
      );
      projectRequestUpdate(pid, teamSize - 2);
      logger.info(`project request accept for ${pid}`);
    }
    return sendJSONresponse(res, 200, {
      message: `${req.query.pid} accepted by ${req.params.companyId}`,
    });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const rejectProjectRequest = async (req, res, next) => {
  try {
    await ProjectRequest.updateOne(
      { project: req.query.pid },
      {
        $set: {
          isAccepted: false,
          isRejected: true,
        },
      },
      { safe: true, new: true, upsert: true },
    );
    logger.info(`project id: ${req.query.pid} rejected by company`);
    return sendJSONresponse(res, 200, {
      message: `${req.query.pid} rejected by ${req.params.companyId}`,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const showAllProjectsForCompany = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    let companyId = req.params.companyId;
    let associateId = await Associate.find({
      $or: [
        { company: req.params.companyId },
        { associateCompany: req.params.companyId },
      ],
      isAccepted: true,
      removed: false,
      isRejected: false,
    }).select('_id');
    associateId = associateId.map((data) => {
      return data._id;
    });
    let acceptedProject = await ProjectRequest.find({
      isAccepted: true,
      associate: associateId,
    }).populate('project', '_id');
    let memberExistInProject = await Team.find({
      $and: [{ account: req.user._id }, { removed: false }],
    }).populate('project', '_id');
    // let memberExistInProject = await Team.find({
    //   $and: [{ account: req.user._id }, { removed: false }],
    // }).populate('project', '_id');

    acceptedProject = acceptedProject.map((data) => {
      return data.project._id;
    });
    // memberExistInProject = memberExistInProject.map((data) => {
    //   return data.project._id;
    // });
    await Project.find({
      $or: [
        { _id: { $in: acceptedProject } },
        // { _id: { $in: memberExistInProject } },
        {
          company: companyId,
        },
      ],
    })
      .where('removed')
      .equals(false)
      .populate([
        {
          path: 'associate',
          select: 'company associateCompany',
          populate: [
            {
              path: 'company',
              select: '_id',
            },
            {
              path: 'associateCompany',
              select: '_id',
            },
          ],
        },
      ])
      .populate('departments concernedAdmin', 'name _id ')
      // .select('-type -__v  -files -version -optionalRole ')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result);
      })
      .catch((error) => {
        logger.error(`${error}`);
        next(error);
      });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const updateProjectDescription = async (req, res, next) => {
  await Project.findByIdAndUpdate(
    { _id: req.query.pid },
    {
      $set: {
        description: req.body.description,
      },
    },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(() => {
      logger.info(`Description addeed for ${req.params.pid}`);
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'Description updated',
      });
    })
    .catch((err) => {
      logger.error(`Project: ${err}`);
      next(err);
    });
};

const updateProjectOutline = async (req, res, next) => {
  await Project.findByIdAndUpdate(
    { _id: req.query.pid },
    {
      $set: {
        outline: req.body.outline,
      },
    },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(() => {
      logger.info(`Outline addeed for ${req.query.pid}`);
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'Outline updated',
      });
    })
    .catch((err) => {
      logger.error(`${err}`);
      next(err);
    });
};

const getProjectDetails = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.query.pid,
    })
      .populate('files', 'link s3Key')
      .select('outline description color name');
    const memberList = await Team.find({
      $and: [{ project: req.query.pid }, { removed: false }],
    }).populate('account', 'name profileImage');
    project.members = memberList;
    return sendJSONresponse(res, 200, project);
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const changeTitleProject = async (req, res, next) => {
  try {
    await Project.findByIdAndUpdate(
      { _id: req.query.pid },
      { $set: { name: req.body.name } },
      { safe: true, upsert: true, new: true },
    );
    logger.info(`project name change successfully`);
    return sendJSONresponse(res, 200, {
      message: 'Project Name changed',
    });
  } catch (error) {
    logger.error(`${err}`);
    next(err);
  }
};

const archiveProject = async (req, res) => {
  try {
    const projectExist = await Project.findOne(
      {
        _id: req.query.pid,
      },
      { removed: false },
    );
    if (projectExist) {
      const project = await Project.findOneAndUpdate(
        { _id: req.query.pid },
        { $set: { removed: true } },
        { safe: true, upsert: true, new: true },
      );
      const text = `${req.user.name} has archived a project ${project.name}`;

      createCompanyRoleNotification(
        { _id: project.company },
        {
          _id: req.user._id,
          name: req.user.name,
          pusherSock: req.headers.clientid,
        },
        text,
        'project',
      );

      logger.info(`Archive a project  ${req.query.pid}`);
      return sendJSONresponse(res, 200, {
        message: `Archive a project`,
      });
    } else {
      logger.error(`Already Archived`);
      return sendErrorResponse(res, 400, 'ProjectIdNotFoundError', {
        message: 'Already Archived',
      });
    }
  } catch (error) {
    logger.error(`Project: ${error}`);
    return sendErrorResponse(res, 404, 'ProjectIdNotFoundError', {
      message: 'Project id is not found',
    });
  }
};

const showAllFilesForProject = async (req, res, next) => {
  const { limit = 10, skip = 0 } = req.query;
  await File.find({ project: req.query.pid })
    .select('link s3Key')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      logger.info(`get all files from project ${req.params.pid}`);
      return sendJSONresponse(res, 200, { success: true, result });
    })
    .catch((err) => {
      logger.error(`Project: ${err}`);
      next(err);
    });
};

const suggestConcernAdmin = async (req, res, next) => {
  try {
    const name = req.query.name;
    const companyId = req.params.companyId;
    if (name) {
      let body = {
        size: 200,
        from: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  company: {
                    value: companyId,
                  },
                },
              },
              {
                multi_match: {
                  query: name,
                  type: 'phrase_prefix',
                  fields: [
                    'account.email',
                    'account.firstName',
                    'account.lastName',
                    'account.name',
                  ],
                },
              },
            ],
          },
        },
      };

      const response = await search(memberIndex, '_doc', body);

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
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const suggestAssociateCompany = async (req, res, next) => {
  try {
    const name = req.query.name;
    const companyId = req.params.companyId;
    const companyName = req.query.companyName;

    if (name) {
      let body = {
        size: 200,
        from: 0,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: companyId,
                  fields: ['company_id', 'associateCompany_id'],
                },
              },
              {
                multi_match: {
                  query: name,
                  type: 'phrase_prefix',
                  fields: ['companyName', 'associateCompanyName'],
                },
              },
              {
                multi_match: {
                  query: companyName,
                  type: 'phrase_prefix',
                  fields: ['companyName', 'associateCompanyName'],
                },
              },
            ],
          },
        },
      };

      const response = await search(associateIndex, '_doc', body);

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
    logger.error(`${error}`);
    next(error);
  }
};

const archiveProjectList = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  await Project.find({
    $and: [
      {
        $or: [
          { company: req.params.companyId },
          { associate: { $in: req.params.companyId } },
        ],
      },
      { removed: true },
    ],
  })
    .populate('departments', 'name _id')
    .select('name members')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      return sendJSONresponse(res, 200, result);
    })
    .catch((err) => {
      logger.error(`Project: ${err}`);
      next(err);
    });
};

const authorizeProjectRole = (functionalRole, ...userRoles) => {
  return async function (req, res, next) {
    try {
      const team = await Team.findOne({
        $and: [
          { account: req.user._id },
          { project: req.query.pid },
          { removed: false },
        ],
      });
      if (
        !team ||
        (functionalRole === 'all' && !userRoles.includes(team.role))
      ) {
        return sendErrorResponse(res, 403, 'AccessError', {
          message: `Restricted`,
        });
      }
      req.team = team;
      next();
    } catch (error) {
      logger.error(`Project: ${error}`);
      next(error);
    }
  };
};

// get companies list for individual user
const getProjectIndividual = async (req, res, next) => {
  try {
    // populate options
    let options = [
      {
        path: 'project',
        select: '_id name optionalRole',
      },
    ];
    let projects = await Team.findOne({
      $and: [
        { account: req.params.account },
        { project: req.query.pid },
        {
          removed: false,
        },
      ],
    })
      .select('-_id project role')
      .populate(options);
    return sendJSONresponse(res, 200, { projects });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

//get project list for individual user
const projectListForMember = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    let options = [
      {
        path: 'project',
        select: '_id name type concernedAdmin optionalRole',
        populate: [
          { path: 'concernedAdmin', select: 'firstName lastName' },
        ],
      },
    ];
    let projects = await Team.find({
      member: req.params.memberId,
    })
      .populate(options)
      .sort({
        createdAt: -1,
      })
      .skip(+skip)
      .limit(+limit)
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result);
      });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};
module.exports = {
  createNewProjectForCompany,
  createNewProjectFromHome,
  addAssociateInProject,
  showAllProjectsForCompany,
  updateProjectDescription,
  updateProjectOutline,
  // getProjectLoad,
  getProjectDetails,
  changeTitleProject,
  archiveProject,
  showAllFilesForProject,
  suggestConcernAdmin,
  suggestAssociateCompany,
  archiveProjectList,
  projectPendingRequest,
  acceptProjectRequest,
  rejectProjectRequest,
  authorizeProjectRole,
  updateRole,
  getProjectIndividual,
  projectListForMember,
};
