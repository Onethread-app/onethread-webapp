const { Member } = require('../company/member/member.model');
const { Project } = require('./project.model');
const { ProjectRequest } = require('../request/request.model');
const { Associate } = require('../associate/associate.model');
const { Team } = require('../team-member/team.model');
const Task = require('../task/task.model');
const TaskAssign = require('../task/taskAssign.model');
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
const { createBoard } = require('../board/board.controller');
const {
  createRoom,
  createRoomMember,
} = require('../room/room.controller');
// const { ISOformat } = require('../helpers/DateFormat');
const { sortProjectsByStatus } = require('../helpers/utils');
const {
  findAllProjectsByMemberId,
  findAllFavouriteProjectsByMemberId,
} = require('../services/teams/teams.services');
const { getFormattedTaskForClient } = require('../helpers/utils');
const { get } = require('lodash');

const {
  createBulkTaskStatus,
  getAllStatusInProject,
} = require('../services/task/taskStatus/taskStatus.service');

const isPidExist = async (pid) => {
  return Project.findOne({ _id: pid, removed: false });
};

const teamCreate = async (account, member, project, role) => {
  return Team.create({ account, member, project, role });
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

const getTasksNumbers = async (pid) => {
  const taskNumbers = await Task.find({
    project: pid,
  }).countDocuments();
  const doneTasks = await Task.find({
    project: pid,
    isCompleted: true,
    parentTask: null,
  }).countDocuments();
  return { taskNumbers, doneTasks };
};

const calculateProjectStatus = async (pid) => {
  let status = 'not-started';
  const { taskNumbers, doneTasks } = await getTasksNumbers(pid);
  if (taskNumbers > 0 && taskNumbers === doneTasks) {
    status = 'completed';
  }
  if (taskNumbers > 0 && taskNumbers > doneTasks) {
    status = 'ongoing';
  }
  return status;
};

const createNewProjectFromHome = async (req, res, next) => {
  try {
    const member = await Member.findOne({
      account: req.user._id,
      company: req.body.companyId,
    });
    if (!member) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'You are not added in company',
      });
    }
    const project = await Project.create({
      name: req.body.name,
      concernedAdmin: member.account,
      account: req.user._id,
      deadline: req.body.deadline,
      color: req.body.color,
      company: req.body.companyId,
      description: '',
      outline: '',
      budget: req.body.budget,
      currency: req.body.currency,
    });
    logger.info(`new project created`);

    const team = await teamCreate(
      member.account,
      member._id,
      project._id,
      'admin',
    );
    logger.info(
      `${member.account} added into project id: ${project._id}`,
    );

    const room = await createRoom(
      req.body.companyId,
      project._id,
      req.user._id,
      'General',
    );
    logger.info(`General Room Created`);

    await createRoomMember(
      req.body.companyId,
      project._id,
      member.account,
      room._id,
      team._id,
    );
    logger.info(`General Room Member Created`);

    await createBulkTaskStatus(
      req.body.statusList,
      project._id,
      req.user._id,
    );
    logger.info(`Status Created`);

    return sendJSONresponse(res, 201, {
      success: true,
      message: 'New project created',
      project,
    });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const getListOverview = async (req, res, next) => {
  try {
    const memberList = await Member.find({
      account: req.user._id,
      removed: false,
    })
      .select('_id company')
      .populate('company', 'uniqueName');

    const projectList = [];
    await Promise.all(
      memberList.map(async (member) => {
        const teamMembers = await Team.find({
          member: member._id,
          removed: false,
        }).populate(
          'project',
          '_id name uniqueName hasDeleted removed createdAt',
        );

        for (let teamMember of teamMembers) {
          if (
            !teamMember.project.hasDeleted &&
            !teamMember.project.removed
          ) {
            projectList.push({
              _id: teamMember.project._id,
              name: teamMember.project.name,
              companyUniqueName: member.company.uniqueName,
              createdAt: teamMember.createdAt,
            });
          }
        }
      }),
    );

    projectList.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    return res.json({ projectList });
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
    // const text = `${asso.company.name} has accepted request `;
    // createCompanyRoleNotification(
    //   asso.company._id,
    //   {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     pusherSock: req.headers.clientid,
    //   },
    //   text,
    //   'project',
    // );
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
    let members = await Member.find({
      account: req.user._id,
      company: req.headers.companyid,
    }).select('_id');
    members = members.map((member) => member._id);
    let teamProjects = await findAllProjectsByMemberId(members);
    teamProjects = teamProjects.filter(
      (tp) => tp.project.hasDeleted === false,
    );
    const projects = await Promise.all(
      teamProjects.map(async (tP) => {
        const { taskNumbers, doneTasks } = await getTasksNumbers(
          tP.project._id,
        );
        return {
          isFavourite: tP.isFavourite,
          member: tP.member._id,
          ...tP.project._doc,
          totalTasks: taskNumbers,
          remainingTasks: taskNumbers - doneTasks,
        };
      }),
    );
    const sortedProjects = sortProjectsByStatus(projects);
    return sendJSONresponse(res, 200, sortedProjects);
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const updateProjectDescription = async (req, res, next) => {
  let checkPid = isPidExist(req.query.pid);
  if (!checkPid) {
    return sendErrorResponse(res, 404, 'NotFound', {
      message: 'pid is not exist',
    });
  }
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
      logger.info(`Project: Description addeed for ${req.query.pid}`);
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
      .select(
        'outline description color name status totalSpent company createdAt deadline',
      )
      .populate([
        {
          path: 'files',
          select: 'link s3Key',
        },
        {
          path: 'company',
          select: '_id uniqueName',
        },
      ]);

    const members = await Team.find({
      project: req.query.pid,
      removed: false,
    }).populate('account', 'name profileImage');

    const taskStatus = await getAllStatusInProject(req.query.pid);

    return sendJSONresponse(res, 200, {
      ...project._doc,
      members,
      taskStatus,
    });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const status = await calculateProjectStatus(req.query.pid);
    await Project.findByIdAndUpdate(
      { _id: req.query.pid },
      {
        $set: {
          name: req.body.name,
          color: req.body.color,
          deadline: req.body.deadline,
          budget: req.body.budget,
          currency: req.body.currency,
          status,
        },
      },
      { safe: true, upsert: true, new: true },
    ).exec();
    logger.info(`project name change successfully`);
    return sendJSONresponse(res, 200, {
      message: 'Project Name changed',
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const archiveProject = async (req, res) => {
  try {
    const projectExist = await Project.findOne(
      { _id: req.query.pid },
      { removed: false },
    );
    if (projectExist) {
      const project = await Project.findOneAndUpdate(
        { _id: req.query.pid },
        { $set: { removed: true, status: 'archived' } },
        { safe: true, upsert: true, new: true },
      );
      logger.info(`Project: Archive a project  ${req.query.pid}`);
      return sendJSONresponse(res, 200, {
        message: `Archive a project`,
      });
    } else {
      logger.error(`Project: Already Archived`);
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Already Archived',
      });
    }
  } catch (error) {
    logger.error(`Project: ${error}`);
    return sendErrorResponse(res, 404, 'NotFound', {
      message: 'Project id is not found',
    });
  }
};

const unarchiveProject = async (req, res) => {
  try {
    const projectExist = await Project.findOne(
      {
        _id: req.query.pid,
      },
      { removed: true },
    );
    if (projectExist) {
      const project = await Project.findOneAndUpdate(
        { _id: req.query.pid },
        { $set: { removed: false, status: 'ongoing' } },
        { safe: true, upsert: true, new: true },
      );

      logger.info(`Project: Unarchive a project  ${req.query.pid}`);
      return sendJSONresponse(res, 200, {
        message: `Unarchived project`,
        project,
      });
    } else {
      logger.error(`Project: Not Archived`);
      return sendErrorResponse(res, 400, 'NotFound', {
        message: 'Project has not been archived yet',
      });
    }
  } catch (error) {
    logger.error(`Project: ${error}`);
    return sendErrorResponse(res, 404, 'NotFound', {
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

const deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndUpdate(
      { _id: req.query.pid },
      { $set: { hasDeleted: true } },
      { safe: true, upsert: true, new: true },
    );
    return sendJSONresponse(res, 200, { success: true });
  } catch (err) {
    logger.error(`Project: ${err}`);
    next(err);
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
      { removed: true, hasDeleted: false },
    ],
  })
    .populate('departments', 'name _id')
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
        { removed: false },
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

const nameWordCapitalize = (name) =>
  name
    .split(' ')
    .map((t) => t[0].toUpperCase() + t.slice(1))
    .join(' ');

const projectOverview = async (req, res, next) => {
  try {
    const projectId = req.query.pid;
    const project = await Project.findById(projectId)
      .populate([
        {
          path: 'concernedAdmin',
          select: '_id firstName lastName profileImage',
        },
        {
          path: 'company',
          select: 'uniqueName',
        },
      ])
      .select('name status deadline concernedAdmin createdAt');
    let response = {
      project: {
        _id: projectId,
        name: nameWordCapitalize(project.name),
        status: nameWordCapitalize(project.status),
        deadline: project.deadline,
        lead: project.concernedAdmin
          ? nameWordCapitalize(
              project.concernedAdmin.firstName +
                ' ' +
                project.concernedAdmin.lastName,
            )
          : null,
        startingDate: project.createdAt,
        companyUniqueName: project.company.uniqueName,
      },
    };
    response.tasks = [];
    let tasks = await Task.find({ project: projectId })
      .select('name status dueDate priority')
      .populate([
        {
          path: 'assignedPerson',
          select: '_id firstName lastName profileImage',
        },
        {
          path: 'boardId',
          select: '_id name',
        },
      ]);
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const taskInf = {
        taskId: task._id,
        name: task.name,
        status: nameWordCapitalize(task.status),
        dueDate: task.dueDate,
        priority: task.priority,
        boardId: task.boardId._id,
      };
      let assignedTo = await TaskAssign.findOne({
        taskId: task._id,
      })
        .populate([
          {
            path: 'assignedPerson',
            select: '_id firstName lastName profileImage',
          },
        ])
        .select('assignedPerson');
      taskInf.assign =
        assignedTo && assignedTo.assignedPerson
          ? nameWordCapitalize(
              assignedTo.assignedPerson.firstName +
                ' ' +
                assignedTo.assignedPerson.lastName,
            )
          : null;

      taskInf.boardName = task.boardId.name;
      response.tasks.push(taskInf);
    }
    return res.json({ success: true, response });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const deleteTeamMember = async (req, res, next) => {
  try {
    await Team.updateOne(
      {
        _id: req.params.accountId,
        project: req.params.projectId,
      },
      {
        $set: { removed: true },
      },
    );

    return res.status(200).json({
      message: 'member deleted successfully',
    });
  } catch (error) {
    logger.error(`Project: ${error}`);
    next(error);
  }
};

const getAllProjectForUser = async (req, res, next) => {
  try {
    let members = await Member.find({
      account: req.user._id,
    }).select('_id');
    members = members.map((member) => member._id);
    let teamProjects = await findAllProjectsByMemberId(members);
    teamProjects = teamProjects.filter(
      (tp) => tp.project.hasDeleted === false,
    );
    const projects = await Promise.all(
      teamProjects.map(async (tP) => {
        const { taskNumbers, doneTasks } = await getTasksNumbers(
          tP.project._id,
        );
        return {
          isFavourite: tP.isFavourite,
          member: tP.member._id,
          ...tP.project._doc,
          totalTasks: taskNumbers,
          remainingTasks: taskNumbers - doneTasks,
        };
      }),
    );
    const sortedProjects = sortProjectsByStatus(projects);
    // console.log(projects);
    return sendJSONresponse(res, 200, sortedProjects);
  } catch (error) {
    logger.error(`Project ${error}`);
    next(error);
  }
};

const favouriteProject = async (req, res, next) => {
  try {
    await Team.findOneAndUpdate(
      { project: req.query.pid, member: req.body.member },
      { $set: { isFavourite: req.body.isFavourite } },
      { safe: true, upsert: true },
    );
    return sendJSONresponse(res, 200, {
      message: `${
        req.body.isFavourite ? 'Favourite' : 'Unfavourite'
      } a project`,
    });
  } catch (error) {
    logger.error(`Project ${error}`);
    next(error);
  }
};

const getAllFavouriteProjects = async (req, res, next) => {
  try {
    let members = await Member.find({
      account: req.user._id,
    }).select('_id');
    members = members.map((member) => member._id);
    const projects = await findAllFavouriteProjectsByMemberId(
      members,
    );
    const response = projects.filter(
      (p) => p.project.hasDeleted === false,
    );
    return sendJSONresponse(res, 200, response);
  } catch (error) {
    logger.error(`Project ${error}`);
    next(error);
  }
};

const populateArray = [
  { path: 'project', select: '_id name' },
  { path: 'company', select: '_id name uniqueName' },
  {
    path: 'status',
    select: '_id name',
  },
  {
    path: 'account',
    select: '_id firstName lastName profileImage',
  },
];

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      project: req.query.pid,
    }).populate(populateArray);
    const formattedTasks = await getFormattedTaskForClient(tasks);
    return sendJSONresponse(res, 200, formattedTasks);
  } catch (error) {
    logger.error(`Project ${error}`);
    next(error);
  }
};

module.exports = {
  calculateProjectStatus,
  createNewProjectFromHome,
  addAssociateInProject,
  showAllProjectsForCompany,
  updateProjectDescription,
  updateProjectOutline,
  // getProjectLoad,
  getProjectDetails,
  updateProject,
  archiveProject,
  unarchiveProject,
  showAllFilesForProject,
  suggestConcernAdmin,
  suggestAssociateCompany,
  archiveProjectList,
  projectPendingRequest,
  acceptProjectRequest,
  rejectProjectRequest,
  updateRole,
  getProjectIndividual,
  projectListForMember,
  projectOverview,
  deleteProject,
  getListOverview,
  deleteTeamMember,
  getAllProjectForUser,
  favouriteProject,
  getAllFavouriteProjects,
  getTasks,
};
