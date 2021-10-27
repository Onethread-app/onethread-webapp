const Task = require('./task.model');
const BoardColumn = require('./../boardColumn/boardColumn.model');
const logger = require('../../config/winston');
const TaskAssign = require('./taskAssign.model');
const { Project } = require('../project/project.model');
const {
  calculateProjectStatus,
} = require('../project/project.controller');
const Board = require('../board/board.model');
const SubTask = require('./subtask/subtask.model');
const TaskStatus = require('./taskStatus/taskStatus.model');

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

const addMemberToTask = async (assignmembers, taskId, req) => {
  const requestedMembers = req.body.assignmembers;
  const newMembers = assignmembers.map((memberId) => {
    return {
      taskId: taskId,
      account: req.user._id,
      assignedPerson: memberId,
    };
  });
  // TODO: Permission Error
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

// Private route
// headers: companyid
// query: pid
// body: name, description, status, priority, dueDate, assignmembers

const isEqual = (a, b) => {
  if (!a || !b) return false;
  return a.toString() === b.toString();
};

// Headers: companyid
// query: pid
// body: status, name, description, priority, dueDate,
// private

const create = async (req, res, next) => {
  try {
    // Get Company & Project ID
    const companyId = req.headers.companyid;
    const pid = req.query.pid;

    // Get Task Status
    const taskStatus = await TaskStatus.findById(
      req.body.status,
    ).select('project');

    // Validation & Error Checking
    if (!taskStatus) {
      sendErrorResponse(res, 404, 'NotFound', {
        message: 'Task Status not found',
      });
    }
    if (!isEqual(taskStatus.project, pid)) {
      sendErrorResponse(res, 400, 'ValidationError', {
        message: 'Project ID mismatch',
      });
    }

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

    const members = await addMemberToTask(
      req.body.assignmembers,
      task._id,
      req,
    );

    await Project.findByIdAndUpdate(
      { _id: pid },
      { $set: { status: 'ongoing' } },
      { safe: true, upsert: true, new: true },
    );
    const responseData = {
      _id: task._id,
      name: task.name,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assignedMembers: members,
      project: task.project,
    };
    logger.info(`Task column create`);
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
  return res.json(req.task);
};

const getMembers = async (req, res, next) => {
  try {
    const taskAssign = await TaskAssign.find({
      taskId: req.task._id,
    })
      .select('_id assignedPerson account')
      .populate([
        {
          path: 'assignedPerson account',
          select: '_id firstName lastName profileImage',
        },
      ]);
    return res.status(200).send(taskAssign);
  } catch (error) {
    logger.error(`Task- Get Members: ${error}`);
    next(error);
  }
};

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
    logger.info(`Task Member: ${error}`);
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
    return res.status(200).json({ members });
  } catch (error) {
    logger.error(`Suggest member: ${error}`);
    logger.next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    await TaskAssign.findOneAndDelete({
      _id: req.query.assignedMemberid,
      taskId: req.params.taskId,
    });
    res.status(200).json({ message: 'MEMBER DELETED' });
  } catch (error) {
    logger.error(`Delete Member: ${error}`);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      { _id: req.task._id },
      req.body,
      { new: true },
    )
      .populate('account', '_id firstName lastName')
      .populate('status', '_id name');
    return sendJSONresponse(res, 200, {
      message: 'Task Updated.',
      task,
    });
  } catch (error) {
    logger.error(`Task Update: ${error}`);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const subTasks = await SubTask.find({ taskId }).select('_id');
    const subTaskIds = subTasks.map((sub) => sub._id);
    if (subTaskIds.length > 0) {
      await SubTask.deleteMany({ _id: { $in: subTaskIds } });
    }
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

    return res.status(200).json({ success: true });
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
    const taskListToday = await Task.find({
      dueDate: { $gte: startToday, $lte: endToday },
    });
    let taskId = taskListToday.map((i) => i._id);
    const todayCounter = {};

    const userTaskListToday = await TaskAssign.find({ taskId })
      .populate({ path: 'account', select: '_id name email' })
      .populate({ path: 'assignedPerson', select: '_id name email' })
      .populate({ path: 'taskId', select: '_id name' });

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
    const taskListTomorrow = await Task.find({
      dueDate: { $gte: startToday, $lte: tomorrowEnd },
    });
    taskId = taskListTomorrow.map((i) => i._id);
    const userTaskListTomorrow = await TaskAssign.find({ taskId })
      .populate({ path: 'account', select: '_id name email' })
      .populate({ path: 'assignedPerson', select: '_id name email' });

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

    const subtaskList = await SubTask.find({
      taskId,
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
};
