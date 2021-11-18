const Task = require('./task.model');
const logger = require('../../config/winston');
const TaskAssign = require('./taskAssign.model');
const { Project } = require('../project/project.model');
const {
  calculateProjectStatus,
} = require('../project/project.controller');
const Board = require('../board/board.model');
const TaskStatus = require('./taskStatus/taskStatus.model');
const {
  getAllStatusInProject,
} = require('../services/task/taskStatus/taskStatus.service');

const {
  taskAssignNotificationToUsers,
  sendNotificationToProjectTeamMates,
  notifyToBoardMembers,
} = require('../notification/notification.controller');

const {
  triggerUnreadNotifications,
  triggerMessage,
} = require('../services/webpush.services');

const _ = require('lodash');
const {
  sendErrorResponse,
  sendJSONresponse,
} = require('../helpers/jsonResponse');
const { Team } = require('../team-member/team.model');
const { getTaskMembers } = require('../helpers/utils');

const {
  sendMailAsTaskReminder,
} = require('../services/email.services');
const {
  findSubtasksByTaskId,
  getAssignedMembers,
} = require('../services/task/task.service');

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
  { path: 'file', select: '_id link s3Key' },
];

// OK
const addMemberToTask = async (assignmembers, taskId, req) => {
  const requestedMembers = assignmembers;
  const newMembers = assignmembers.map((memberId) => {
    return {
      taskId: taskId,
      account: req.user._id,
      assignedPerson: memberId,
    };
  });
  await TaskAssign.insertMany(newMembers);
  const members = await TaskAssign.find({
    taskId,
    assignedPerson: { $in: requestedMembers },
  })
    .select('_id assignedPerson account')
    .populate({
      path: 'assignedPerson account',
      select: '_id firstName lastName profileImage',
    });

  await Promise.all(
    members.map(async (e) => {
      if (req.user._id !== e.assignedPerson._id.toString()) {
        await taskAssignNotificationToUsers(
          req.user._id,
          req.headers.companyid,
          e._id,
          e.assignedPerson._id,
          {
            _id: req.user._id,
            name: req.user.name,
            pusherSock: req.headers.clientid,
          },
        );
        await triggerUnreadNotifications(e.assignedPerson._id);
      }
    }),
  );
  return members;
};

// OK
const load = async (req, res, next, id) => {
  try {
    logger.info('Task is loading....');
    const task = await Task.findById(id).populate(populateArray);

    if (!task) {
      return sendErrorResponse(res, 404, 'NotFound', {
        success: false,
        message: 'No valid entry found for provided Task ID',
      });
    }
    // Tasks
    const taskDetails = task.toJSON();
    // Subtasks
    taskDetails.subTasks = await findSubtasksByTaskId(
      task._id,
      populateArray,
    );
    //statusList
    taskDetails.statusList = await getAllStatusInProject(
      taskDetails.project._id,
    );
    // Members
    taskDetails.members = await getAssignedMembers(task._id);
    req.task = taskDetails;
    logger.info('Task loading completed');
    next();
  } catch (error) {
    logger.error(`Task Load: ${error}`);
    next(error);
  }
};

// OK
const createSubtask = async (req, res, next) => {
  try {
    const draftStatus = await TaskStatus.findOne({
      project: req.query.pid,
      positionInBoard: 0,
    });
    if (!draftStatus) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Task Status not found',
      });
    }
    const subTask = await Task.create({
      name: req.body.name,
      description: req.body.description,
      account: req.user._id,
      parentTask: req.task._id,
      company: req.headers.companyid,
      project: req.query.pid,
      status: draftStatus._id,
    });

    return sendJSONresponse(res, 201, subTask);
  } catch (error) {
    logger.error(`SubTask Creation: ${error}`);
    next(error);
  }

  const task = await Task.findById(id).populate([
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
    { path: 'file', select: '_id link s3Key' },
  ]);

  if (!task) {
    return sendErrorResponse(res, 404, 'NotFound', {
      success: false,
      message: 'No valid entry found for provided Task ID',
    });
  }

  req.task = task;
  next();
};

const create = async (req, res, next) => {
  try {
    // Get Company & Project ID
    const companyId = req.headers.companyid;
    const pid = req.query.pid;

    // TODO: Do we need this?
    // Get Task Status
    // const taskStatus = await TaskStatus.findOne({
    //   name: 'Draft',
    //   project: pid,
    // }).select('_id project');

    // // Validation & Error Checking
    // if (!taskStatus) {
    //   return sendErrorResponse(res, 404, 'NotFound', {
    //     message: 'Task Status (Draft) not found',
    //   });
    // }
    console.log(req.body);

    // Create Task
    const task = await Task.create({
      name: req.body.name,
      description: req.body.description,
      account: req.user._id,
      status: req.body.status,
      project: pid,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      company: companyId,
    });

    const populatedTask = await task
      .populate(populateArray)
      .execPopulate();

    const members = await addMemberToTask(
      req.body.assignmembers,
      task._id,
      req,
    );

    const statusList = await getAllStatusInProject(pid);

    await Project.findByIdAndUpdate(
      { _id: pid },
      { $set: { status: 'ongoing' } },
      { safe: true, upsert: true, new: true },
    );

    const responseData = populatedTask.toJSON();
    responseData.members = members;
    responseData.statusList = statusList;
    responseData.subTasks = [];
    // await sendNotificationToProjectTeamMates(
    //   req.user._id,
    //   companyId,
    //   pid,
    //   task._id,
    //   columnId,
    //   boardId,
    //   {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     pusherSock: req.headers.clientid,
    //   },
    // );
    return sendJSONresponse(res, 201, responseData);
  } catch (error) {
    logger.error(`Task Creation: ${error}`);
    next(error);
  }
};

const get = (req, res, next) => {
  return sendJSONresponse(res, 200, req.task);
};

const getMembers = async (req, res, next) => {
  try {
    const taskAssign = await getAssignedMembers(req.task._id);
    return sendJSONresponse(res, 200, taskAssign);
  } catch (error) {
    logger.error(`Task- Get Members: ${error}`);
    next(error);
  }
};

// TODO: Not Done
const addMember = async (req, res, next) => {
  try {
    const requestedMembers = req.body.assignmembers;
    const boardID = req.task.boardId;

    //get current task board to check members in board
    const currentTaskBoard = await Board.findOne({
      _id: boardID,
    });

    //convert current taskboard members to check the difference between them
    const Members = currentTaskBoard.members.map((member) =>
      member.toString(),
    );

    //new members who are  not in baord
    const newBoardmember = _.difference(requestedMembers, Members);

    //new members to add in task
    const newMembers = requestedMembers.map((memberId) => {
      return {
        taskId: req.task._id,
        account: req.user._id,
        assignedPerson: memberId,
      };
    });
    //check the difference's
    //if new member who is already in board , just add in task
    //others add them in board first

    if (_.isEmpty(newMembers)) {
      TaskAssign.insertMany(newMembers).then((taskMember) => {
        TaskAssign.find({
          taskId: req.task._id,
          assignedPerson: {
            $in: requestedMembers,
          },
        })
          .select('_id assignedPerson account')
          .populate([
            {
              path: 'assignedPerson account',
              select: '_id firstName lastName profileImage',
            },
          ])
          .exec()
          .then((result) => {
            result.map(async (e) => {
              if (req.user._id !== e.assignedPerson._id) {
                await taskAssignNotificationToUsers(
                  req.user._id,
                  req.headers.companyid,
                  e._id,
                  e.assignedPerson._id,
                  {
                    _id: req.user._id,
                    name: req.user.name,
                    pusherSock: req.headers.clientid,
                  },
                );
              }
            });
            return sendJSONresponse(res, 201, result);
          });
      });
    } else {
      TaskAssign.insertMany(newMembers).then((taskMember) => {
        TaskAssign.find({
          taskId: req.task._id,
          assignedPerson: {
            $in: requestedMembers,
          },
        })
          .select('_id assignedPerson account')
          .populate([
            {
              path: 'assignedPerson account',
              select: '_id firstName lastName profileImage',
            },
          ])
          .exec()
          .then((result) => {
            //TODO: need to combine both function
            result.map(async (e) => {
              if (req.user._id !== e.assignedPerson._id) {
                await taskAssignNotificationToUsers(
                  req.user._id,
                  req.headers.companyid,
                  e._id,
                  e.assignedPerson._id,
                  {
                    _id: req.user._id,
                    name: req.user.name,
                    pusherSock: req.headers.clientid,
                  },
                );
              }
            });
            return sendJSONresponse(res, 201, result);
          });
      });
    }
  } catch (error) {
    logger.error(`Task: ${error}`);
    next(error);
  }
};

const suggestMemberForCreatingTask = async (req, res, next) => {
  try {
    let projectMembers = await Team.find({
      project: req.query.pid,
    })
      .select('_id account')
      .populate('account', '_id name');
    let members = projectMembers.map((m) => m.account);
    return sendJSONresponse(res, 200, members);
  } catch (error) {
    logger.info(`Suggest member for creating task: ${error}`);
    next(error);
  }
};

const suggestMember = async (req, res, next) => {
  try {
    let taskMembers = await TaskAssign.find({
      taskId: req.params.taskId,
    })
      .select('-_id assignedPerson')
      .populate('assignedPerson', '_id name');

    let projectMembers = await Team.find({
      project: req.query.pid,
    })
      .select('_id account')
      .populate('account', '_id name');

    let members = projectMembers.filter(({ account }) => {
      return !taskMembers.some((existingMember) => {
        return (
          existingMember.assignedPerson._id.toString() ===
          account._id.toString()
        );
      });
    });

    members = members.map((m) => m.account);
    return sendJSONresponse(res, 200, { members });
  } catch (error) {
    logger.error(`Suggest member: ${error}`);
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    await TaskAssign.findByIdAndDelete(req.query.assignedMemberid);
    return sendJSONresponse(res, 200, { message: 'Member deleted' });
  } catch (error) {
    logger.error(`Delete member: ${error}`);
    next(error);
  }
};
// OK
const update = async (req, res, next) => {
  try {
    let task = await Task.findByIdAndUpdate(
      { _id: req.task._id },
      req.body,
      { new: true },
    ).populate(populateArray);

    task = task.toJSON();
    // Subtasks
    task.subTasks = await findSubtasksByTaskId(
      task._id,
      populateArray,
    );
    //statusList
    task.statusList = await getAllStatusInProject(task.project._id);
    // Members
    task.members = await getAssignedMembers(task._id);
    return sendJSONresponse(res, 200, {
      message: 'Task Updated.',
      task,
    });
  } catch (error) {
    logger.error(`Task Update: ${error}`);
    next(error);
  }
};

// OK
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    await Task.deleteMany({ parentTask: taskId });
    await Task.findByIdAndDelete(taskId);
    const status = await calculateProjectStatus(req.query.pid);
    await Project.findByIdAndUpdate(
      { _id: req.query.pid },
      { $set: { status } },
      { safe: true, upsert: true, new: true },
    );
    return sendJSONresponse(res, 200, { message: 'Task Deleted.' });
  } catch (error) {
    logger.error(`Task Deletion: ${error}`);
    next(error);
  }
};
// OK
const markAsCompleted = async (req, res, next) => {
  try {
    await Promise.all(
      req.body.task.map(async (task) => {
        await Task.findByIdAndUpdate(
          { _id: task },
          { $set: { isCompleted: true, completedBy: req.user._id } },
          { safe: true, upsert: true, new: true },
        );
        const status = await calculateProjectStatus(req.query.pid);
        await Project.findByIdAndUpdate(
          { _id: req.query.pid },
          { $set: { status } },
          { safe: true, upsert: true, new: true },
        );
      }),
    );

    return sendJSONresponse(res, 200, { success: true });
  } catch (error) {
    logger.error(`Task - Mark as Completed: ${error}`);
    next(error);
  }
};

const dragTask = async (req, res, next) => {
  try {
    const { destinationStatusId, sourceStatusId, taskId } = req.body;
    const sourceStatus = await TaskStatus.findById(sourceStatusId);
    if (!sourceStatus) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Source Task Status not found',
      });
    }

    const destinationStatus = await TaskStatus.findById(
      destinationStatusId,
    );
    if (!destinationStatus) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Destination Task Status not found',
      });
    }

    await Task.findByIdAndUpdate(
      taskId,
      { $set: { status: destinationStatusId } },
      { safe: true, upsert: true, new: true },
    );

    // await notifyToBoardMembers(
    //   req.user._id,
    //   req.headers.companyid,
    //   taskId,
    //   {
    //     _id: req.user._id,
    //     name: req.user.name,
    //     pusherSock: req.headers.clientid,
    //   },
    //   req.body.sourceColumnId,
    //   req.body.destinationColumnId,
    // );

    return sendJSONresponse(res, 200, { success: true });
  } catch (error) {
    logger.error(`Drag task: ${error}`);
    next(error);
  }
};

const taskReminder = async (req, res, next) => {
  try {
    // For Sending Mail (Map: Account -> Task)
    let todaysTaskNames = {};
    let todaysSubtaskNames = {};

    // All account Id - Unique - Webpush Notify
    let allUsernameList = [];
    let usernameIdMapper = {};
    let usernameEmailMapper = {};

    // Today - Start, End
    let startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    let endToday = new Date();
    endToday.setHours(23, 59, 59, 999);
    // Tomorrow - End
    let tomorrowEnd = new Date();
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 100);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Todays Task
    // TaskQuery - 1
    const taskListToday = await Task.find({
      dueDate: { $gte: startToday, $lte: endToday },
      parentTask: null,
    });
    let taskId = taskListToday.map((i) => i._id);
    let todayTaskIds = taskId;
    const todayCounter = {};
    let userTaskListToday = await TaskAssign.find({ taskId })
      .populate({ path: 'account', select: '_id name email' })
      .populate({ path: 'assignedPerson', select: '_id name email' })
      .populate({ path: 'taskId', select: '_id name' });

    userTaskListToday = userTaskListToday.filter(
      (ut) => ut.account && ut.assignedPerson && ut.taskId,
    );

    for (let task of userTaskListToday) {
      // Assigned by me
      const assignedBy = task.account.name;
      // map: account username -> Task []
      if (!todaysTaskNames[assignedBy]) {
        todaysTaskNames[assignedBy] = [];
      }
      todaysTaskNames[assignedBy].push({
        _id: task.taskId._id,
        name: task.taskId.name,
      });

      // Count
      if (!todayCounter[assignedBy]) todayCounter[assignedBy] = 0;
      todayCounter[assignedBy]++;

      // Store usernames
      allUsernameList.push(assignedBy);
      usernameIdMapper[assignedBy] = task.account._id;
      usernameEmailMapper[assignedBy] = task.account.email;

      // Assigned to me
      const assignedTo = task.assignedPerson.name;
      if (assignedBy === assignedTo) continue;

      if (!todaysTaskNames[assignedTo]) {
        todaysTaskNames[assignedTo] = [];
      }
      todaysTaskNames[assignedTo].push({
        _id: task.taskId._id,
        name: task.taskId.name,
      });

      if (!todayCounter[assignedTo]) todayCounter[assignedTo] = 0;
      todayCounter[assignedTo]++;

      allUsernameList.push(assignedTo);
      usernameIdMapper[assignedTo] = task.assignedPerson._id;
      usernameEmailMapper[assignedTo] = task.assignedPerson.email;
    }

    const tomorrowCounter = {};
    // TaskQuery - 2
    const taskListTomorrow = await Task.find({
      dueDate: { $gte: startToday, $lte: tomorrowEnd },
      parentTask: null,
    });
    taskId = taskListTomorrow.map((i) => i._id);
    let userTaskListTomorrow = await TaskAssign.find({ taskId })
      .populate({ path: 'account', select: '_id name email' })
      .populate({ path: 'assignedPerson', select: '_id name email' });

    userTaskListTomorrow = userTaskListTomorrow.filter(
      (ut) => ut.account && ut.assignedPerson && ut.taskId,
    );

    for (let task of userTaskListTomorrow) {
      // Assign by me
      const assignedBy = task.account.name;
      if (!tomorrowCounter[assignedBy]) {
        tomorrowCounter[assignedBy] = 0;
      }
      tomorrowCounter[assignedBy]++;
      allUsernameList.push(assignedBy);
      usernameIdMapper[assignedBy] = task.account._id;
      usernameEmailMapper[assignedBy] = task.account.email;

      // Assign to me
      const assignedTo = task.assignedPerson.name;
      if (assignedBy === assignedTo) continue;

      if (!tomorrowCounter[assignedTo]) {
        tomorrowCounter[assignedTo] = 0;
      }
      tomorrowCounter[assignedTo]++;
      allUsernameList.push(assignedTo);
      usernameIdMapper[assignedTo] = task.assignedPerson._id;
      usernameEmailMapper[assignedTo] = task.assignedPerson.email;
    }

    // TaskQuery-3
    const subtaskList = await Task.find({
      parentTask: todayTaskIds,
      dueDate: { $gte: startToday, $lte: endToday },
    })
      .populate({ path: 'account', select: '_id name email' })
      .populate({ path: 'assignedMembers', select: '_id name email' })
      .populate({ path: 'taskId', select: '_id name' });

    const todaySubTaskCounter = {};
    for (let task of subtaskList) {
      // Assign by me
      const assignedBy = task.account.name;
      if (!todaysSubtaskNames[assignedBy]) {
        todaysSubtaskNames[assignedBy] = [];
      }
      todaysSubtaskNames[assignedBy].push({
        _id: task.taskId._id,
        name: task.taskId.name,
      });
      if (!todaySubTaskCounter[assignedBy]) {
        todaySubTaskCounter[assignedBy] = 0;
      }
      todaySubTaskCounter[assignedBy]++;

      allUsernameList.push(assignedBy);
      usernameIdMapper[assignedBy] = task.account._id;
      usernameEmailMapper[assignedBy] = task.account.email;

      // Assign to me
      for (let st of task.assignedMembers) {
        const assignedTo = st.name;
        if (assignedBy === assignedTo) continue;

        if (!todaysSubtaskNames[assignedTo]) {
          todaysSubtaskNames[assignedTo] = [];
        }
        todaysSubtaskNames[assignedTo].push({
          _id: task.taskId._id,
          name: task.taskId.name,
        });

        if (!todaySubTaskCounter[assignedTo]) {
          todaySubTaskCounter[assignedTo] = 0;
        }
        todaySubTaskCounter[assignedTo]++;

        allUsernameList.push(assignedTo);
        usernameIdMapper[assignedTo] = st._id;
        usernameEmailMapper[assignedTo] = st.email;
      }
    }
    allUsernameList = [...new Set(allUsernameList)];

    await Promise.all(
      allUsernameList.map(async (username) => {
        if (!todayCounter[username]) {
          todayCounter[username] = 0;
        }
        if (!tomorrowCounter[username]) {
          tomorrowCounter[username] = 0;
        }
        if (!todaySubTaskCounter[username]) {
          todaySubTaskCounter[username] = 0;
        }

        await triggerMessage(usernameIdMapper[username], {
          notification: {
            title: 'Task Reminder',
            body: `You have ${todayCounter[username]} tasks and ${todaySubTaskCounter[username]} subtasks today and ${tomorrowCounter[username]} tasks tomorrow`,
            icon: '',
            data: `/${username}/home`,
          },
        });
      }),
    );

    await sendMailAsTaskReminder(
      todaysTaskNames,
      todaysSubtaskNames,
      usernameEmailMapper,
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Task Reminder: ${error}`);
    next(error);
  }
};

module.exports = {
  create,
  get,
  update,
  deleteTask,
  load,
  dragTask,
  addMember,
  getTaskMembers,
  getMembers,
  deleteMember,
  suggestMemberForCreatingTask,
  suggestMember,
  taskReminder,
  createSubtask,
  markAsCompleted,
};
