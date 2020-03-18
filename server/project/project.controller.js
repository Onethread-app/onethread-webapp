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
} = require('../services/elastic.services');
const {
  sendErrorResponse,
  sendJSONresponse,
} = require('../helpers/jsonResponse');
const teamCreate = (account, project, role) => {
  let newTeam = new Team({
    account: account,
    project: project,
    role: role,
  });
  newTeam.save();
};
const createNewProjectForCompany = async (req, res, next) => {
  try {
    const userExist = await Member.findOne({
      account: req.body.concernedAdmin,
    });
    if (!userExist) {
      return sendErrorResponse(res, 404, 'MemberNotFoundError', {
        message: 'concernAdmin not added in company',
      });
    }
    let associates = req.body.associates;
    if (req.body.type === 'associates') {
      const project = new Project({
        name: req.body.name,
        type: req.body.type,
        concernedAdmin: req.body.concernedAdmin,
        departments: req.body.departments,
        color: req.body.color,
        company: req.params.companyId,
        description: '',
        outline: '',
      });
      await project.save();
      // need to be refactored as soon as possible

      associates.map(async asso => {
        const createProjectReq = new ProjectRequest({
          company: req.params.companyId,
          associate: asso._id,
          size: asso.size,
          isAccepted: false,
          project: project._id,
        });
        await createProjectReq.save();
        logger.info(
          `${req.params.companyId} company send a project request to its associate`,
        );
        teamCreate(req.user._id, project._id, 'member');
        logger.info(`project creator add as a member here`);
        teamCreate(req.body.concernedAdmin, project._id, 'admin');
        logger.info(`concern admin add as an admin here`);
      });
      return sendJSONresponse(res, 201, {
        sucees: true,
        message: 'New project created for associate',
        project,
      });
    } else {
      const project = new Project({
        name: req.body.name,
        type: req.body.type,
        concernedAdmin: req.body.concernedAdmin,
        departments: req.body.departments,
        color: req.body.color,
        company: req.body.companyId,
        description: '',
        outline: '',
      });
      await project
        .save()
        .then(project => {
          logger.info(`new project created`);
          return sendJSONresponse(res, 201, {
            sucees: true,
            message: 'New project created',
            project,
          });
        })
        .catch(error => {
          logger.error(`${error}`);
          next(error);
        });
    }
  } catch (error) {
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
    logger.error(`${error}`);
    next(error);
  }
};
const projectPendingRequest = async (req, res, next) => {
  const { limit = 10, skip = 0 } = req.query;
  const companyId = req.params.companyId;

  ProjectRequest.find({
    $and: [{ isAccepted: false }, { associate: companyId }],
  })
    .select('company project')
    .populate('company project')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => {
      logger.info(`pending project list for company:${companyId}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch(e => {
      logger.error(`${e}`);
      next(e);
    });
};

const acceptProjectRequest = async (req, res, next) => {
  try {
    await ProjectRequest.updateOne(
      { project: req.query.pid },
      {
        $set: {
          isAccepted: true,
          isRejected: false,
        },
      },
      { safe: true, new: true, upsert: true },
    );
    logger.info(`project request accept for ${req.query.pid}`);
    await Associate.updateOne(
      {
        company: req.params.companyId,
      },
      {
        $push: { project: req.query.pid },
      },
      { safe: true, upsert: true },
    );
    // logger.info(
    //   `${req.query.companyId} create a project`,
    // );
    await Project.updateOne(
      { _id: req.query.pid },
      {
        $push: { associate: req.params.companyId },
      },
      { safe: true, upsert: true },
    );
    return sendJSONresponse(res, 200, {
      message: `${req.query.pid} accepted by ${req.params.companyId}`,
    });
  } catch (error) {
    logger.error(`${error}`);
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
  const { limit = 50, skip = 0 } = req.query;
  let companyId = req.params.companyId;

  await Project.find({
    $or: [
      { company: companyId, removed: false },
      { associate: { $in: [companyId] }, removed: false },
    ],
  })
    .populate('departments', 'name _id ')
    .select('-type -__v  -files -version -optionalRole ')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => {
      logger.info(`all projects for company:${companyId}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch(e => next(e));
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
    .then(result => {
      logger.info(`Description addeed for ${req.parms.pid}`);
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'Description updated',
      });
    })
    .catch(err => {
      logger.error(`${err}`);
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
    .then(result => {
      logger.info(`Outline addeed for ${req.query.pid}`);
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'Outline updated',
      });
    })
    .catch(err => {
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
    // console.log(req.project)
    return sendJSONresponse(res, 200, project);
  } catch (error) {
    next(error);
  }
};

const changeTitleProject = async (req, res, next) => {
  await Project.findByIdAndUpdate(
    { _id: req.body.pid },
    { $set: { name: req.body.name } },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(result => {
      logger.info(`project name change successfully`);
      return sendJSONresponse(res, 200, {
        message: 'Project Name changed',
      });
    })
    .catch(err => {
      logger.error(`${err}`);
      next(err);
    });
};

const archiveProject = async (req, res, next) => {
  try {
    const projectExist = await Project.findOne({
      _id: req.query.pid,
      removed: false,
    });
    if (projectExist) {
      await Project.updateOne(
        { _id: req.query.pid },
        { $set: { removed: true } },
        { safe: true, upsert: true, new: true },
      );
      logger.info(`Archive a project  ${req.params.pid}`);
      return sendJSONresponse(res, 200, {
        message: `Archive a project`,
      });
    } else {
      logger.error(`project id not found`);
      return sendErrorResponse(res, 404, 'ProjectIdNotFoundError', {
        message: 'Already Archived',
      });
    }
  } catch (error) {
    logger.error(`${error}`);
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
    .then(result => {
      logger.info(`get all files from project ${req.params.pid}`);
      return sendJSONresponse(res, 200, { success: true, result });
    })
    .catch(err => {
      logger.error(`${err}`);
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
    logger.error(`${error}`);
    next(error);
  }
};

const archiveProjectList = async (req, res, next) => {
  await Project.find({ company: req.params.companyId, removed: true })
    .populate('departments', 'name _id')
    .select('name members')
    .exec()
    .then(result => {
      return sendJSONresponse(res, 200, result);
    })
    .catch(err => {
      next(err);
    });
};

const addTeamMember = async (req, res, next) => {
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {
      message: "Expects 'application/json'",
    });
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

const authorizeProjectRole = (functionalRole, ...userRoles) => {
  return async function(req, res, next) {
    try {
      const team = await Team.findOne({
        account: req.user._id,
        project: req.query.pid,
      }).exec();

      if (
        !team ||
        (functionalRole === 'all' && !userRoles.includes(team.role))
      ) {
        return res.status(403).json({
          message: `Restricted`,
        });
      }

      next();
    } catch (error) {
      logger.error(`${error}`);
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
    return res.status(200).json({
      projects,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createNewProjectForCompany,
  showAllProjectsForCompany,
  updateProjectDescription,
  updateProjectOutline,
  // getProjectLoad,
  getProjectDetails,
  changeTitleProject,
  archiveProject,
  showAllFilesForProject,
  suggestConcernAdmin,
  archiveProjectList,
  addTeamMember,
  projectPendingRequest,
  acceptProjectRequest,
  rejectProjectRequest,
  authorizeProjectRole,
  updateRole,
  getProjectIndividual,
};
