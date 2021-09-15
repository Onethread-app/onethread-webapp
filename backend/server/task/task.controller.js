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

const getTaskMembers = async (taskId) => {
  const taskMembers = await TaskAssign.find({
    taskId,
  })
    .select('_id assignedPerson')
    .populate([
      {
        path: 'assignedPerson',
        select: '_id firstName lastName profileImage',
      },
    ])
    .exec();
  return taskMembers;
};

const addMemberToTask = async (
  assignmembers,
  taskId,
  boardId,
  req,
) => {
  const requestedMembers = assignmembers;

  //get current task board to check members in board

  const currentTaskBoard = await Board.findOne({
    _id: boardId,
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
      taskId: taskId,
      account: req.user._id,
      assignedPerson: memberId,
    };
  });

  //check the difference's
  //if new member who is already in board , just add in task
  //others add them in board first

  if (_.isEmpty(newBoardmember)) {
    await TaskAssign.insertMany(newMembers);
    const members = await TaskAssign.find({
      taskId,
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
      .exec();

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
    });
    return members;
  } else {
    await Board.updateOne(
      { _id: boardId },
      { $addToSet: { members: newBoardmember } },
      { safe: true, upsert: true, new: true },
    );

    await TaskAssign.insertMany(newMembers);
    const members = await TaskAssign.find({
      taskId,
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
      .exec();
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
    });
    return members;
  }
};

const load = (req, res, next, id) => {
  Task.findById(id)
    .populate('account', '_id firstName lastName')
    .populate('columnId', '_id name')
    .populate('file', '_id link s3Key')
    .exec()
    .then((result) => {
      req.task = result;
      next();
    })
    .catch(() => {
      return sendErrorResponse(res, 404, 'IdIsNotExits', {
        success: false,
        message: 'No valid entry found for provided Task ID',
      });
    });
};

const create = async (req, res, next) => {
  try {
    const companyId = req.headers.companyid;
    const pid = req.query.pid;
    const boardId = req.body.boardId;
    const columnId = req.body.columnId;
    const columnProject = await BoardColumn.findOne({
      boardId: req.body.boardId,
      _id: req.body.columnId,
    })
      .select('project')
      .exec();

    if (columnProject.project === req.query.pid) {
      const task = new Task({
        name: req.body.name,
        description: req.body.description,
        account: req.user._id,
        status: req.body.status,
        columnId: columnId,
        boardId: boardId,
        project: pid,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
      });
      const createdTask = await task.save();

      const members = await addMemberToTask(
        req.body.assignmembers,
        createdTask._id,
        boardId,
        req,
      );

      // TODO: should use update function
      const column = await BoardColumn.findOne({
        _id: req.body.columnId,
      }).populate({
        path: 'boardId',
        populate: {
          path: 'project',
          model: 'Project',
          select: '_id name company',
        },
      });

      column.tasks.push(createdTask._id);
      await column.save();

      await Project.findByIdAndUpdate(
        { _id: req.query.pid },
        {
          $set: { status: 'ongoing' },
        },
        { safe: true, upsert: true, new: true },
      );
      const responseData = {
        _id: createdTask._id,
        name: createdTask.name,
        description: createdTask.description,
        dueDate: createdTask.dueDate,
        priority: createdTask.priority,
        status: createdTask.status,
        assignedMembers: members,
        boardId: createdTask.boardId,
        columnId: createdTask.columnId,
        project: createdTask.project,
        totalSpent: createdTask.totalSpent,
      };
      logger.info(`Task column create`);
      await sendNotificationToProjectTeamMates(
        req.user._id,
        companyId,
        pid,
        createdTask._id,
        columnId,
        boardId,
        {
          _id: req.user._id,
          name: req.user.name,
          pusherSock: req.headers.clientid,
        },
      );
      return sendJSONresponse(res, 201, responseData);
    } else {
      sendErrorResponse(res, 400, 'ValidationError', {
        message: 'Project ID mismatch',
      });
    }
  } catch (error) {
    logger.error(`Task: ${error}`);
    next(error);
  }
};

const get = (req, res, next) => {
  return res.json(req.task);
};

const getMembers = async (req, res, next) => {
  TaskAssign.find({
    taskId: req.task._id,
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
      res.status(200).send(result);
    })
    .catch((error) => {
      next(error);
    });
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

    if (_.isEmpty(newBoardmember)) {
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
                await triggerUnreadNotifications(
                  e.assignedPerson._id,
                );
              }
            });
            res.status(201).send(result);
          });
      });
    } else {
      await Board.updateOne(
        { _id: boardID },
        { $addToSet: { members: newBoardmember } },
        { safe: true, upsert: true, new: true },
      );

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
            res.status(201).send(result);
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
      .populate('account', '_id name')
      .exec();
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
      .populate('assignedPerson', '_id name')
      .exec();
    let projectMembers = await Team.find({
      project: req.query.pid,
    })
      .select('_id account')
      .populate('account', '_id name')
      .exec();

    let members = projectMembers.filter(({ account }) => {
      return !taskMembers.some((existingMember) => {
        return (
          existingMember.assignedPerson._id.toString() ===
          account._id.toString()
        );
      });
    });

    members = members.map((m) => m.account);
    return res.status(200).json({
      members,
    });
  } catch (error) {
    next(error);
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
    next(error);
  }
};

const update = async (req, res, next) => {
  Task.findByIdAndUpdate({ _id: req.task._id }, req.body, {
    new: true,
  })
    .populate('account', '_id firstName lastName')
    .populate('columnId', '_id name')
    .exec()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      next(error);
    });
};

const deleteTask = async (req, res, next) => {
  try {
    const subTasks = await SubTask.find({
      taskId: req.params.taskId,
    })
      .select('_id')
      .exec();

    const subTaskIds = subTasks.map((sub) => {
      return sub._id;
    });

    if (subTaskIds.length > 0) {
      SubTask.deleteMany({
        _id: {
          $in: subTaskIds,
        },
      }).exec();
    }

    await Task.findByIdAndDelete(req.params.taskId).exec();

    await BoardColumn.findByIdAndUpdate(
      req.body.columnId,
      { $pull: { tasks: { _id: { $in: req.params.taskId } } } },
      { new: true },
    ).exec();

    const status = await calculateProjectStatus(req.query.pid);

    await Project.findByIdAndUpdate(
      { _id: req.query.pid },
      {
        $set: { status },
      },
      { safe: true, upsert: true, new: true },
    ).exec();

    return sendJSONresponse(res, 200, {
      message: 'Task Deleted.',
    });
  } catch (error) {
    logger.error(`Task: ${error}`);
    next(error);
  }
};

const list = (req, res, next) => {};

const dragTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.body.taskId, {
      $set: {
        columnId: req.body.destinationColumnId,
        status: req.body.status,
      },
    }).exec();

    // TODO: avoid task population
    const sourceColumn = await BoardColumn.findByIdAndUpdate(
      req.body.sourceColumnId,
      { $pull: { tasks: req.body.taskId } },
      { new: true },
    )
      .populate('tasks', '_id name description dueDate')
      .exec();

    // TODO: avoid task population
    const destinationColumn = await BoardColumn.findByIdAndUpdate(
      req.body.destinationColumnId,
      {
        $push: {
          tasks: {
            $each: [req.body.taskId],
            $position: req.body.taskIndexOfDestinationColumn,
          },
        },
      },
      { new: true },
    )
      .populate('tasks', '_id name description dueDate')
      .exec();

    const column = await BoardColumn.findOne({
      _id: req.body.destinationColumnId,
    }).populate({
      path: 'boardId',
      populate: {
        path: 'project',
        model: 'Project',
        select: 'name company',
      },
    });

    const status = await calculateProjectStatus(
      column.boardId.project._id,
    );
    await Project.findByIdAndUpdate(
      { _id: column.boardId.project._id },
      {
        $set: { status },
      },
      { safe: true, upsert: true, new: true },
    ).exec();
    await notifyToBoardMembers(
      req.user._id,
      req.headers.companyid,
      req.body.taskId,
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
      req.body.sourceColumnId,
      req.body.destinationColumnId,
    );

    const responseData = {
      sourceColumn: {
        _id: sourceColumn._id,
        tasks: sourceColumn.tasks,
      },
      destinationColumn: {
        _id: destinationColumn._id,
        tasks: destinationColumn.tasks,
      },
    };

    res.status(200).send(responseData);
  } catch (error) {
    logger.error(`Board column create: ${error}`);

    next(error);
  }
};

const taskReminder = async (req, res, next) => {
  let startToday = new Date();
  startToday.setHours(0, 0, 0, 0);

  let endToday = new Date();
  endToday.setHours(23, 59, 59, 999);

  let tomorrowEnd = new Date();
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 100);
  tomorrowEnd.setHours(23, 59, 59, 999);

  let taskId = [];

  const taskListToday = await Task.find({
    dueDate: { $gte: startToday, $lte: endToday },
  });
  taskId = taskListToday.map((i) => i._id);

  const todayCounter = {};
  let todaysTask = [];
  const usernameMapping = {};
  const userTaskListToday = await TaskAssign.find({ taskId })
    .populate({ path: 'account', select: '_id name' })
    .populate({ path: 'assignedPerson', select: '_id name' });

  const idStr = (x) => x._id.toString();

  for (let task of userTaskListToday) {
    if (!todayCounter[idStr(task.account)])
      todayCounter[idStr(task.account)] = 0;
    todayCounter[idStr(task.account)]++;
    todaysTask.push(idStr(task.account));
    usernameMapping[idStr(task.account)] = task.account.name;

    if (!todayCounter[idStr(task.assignedPerson)])
      todayCounter[idStr(task.assignedPerson)] = 0;
    todayCounter[idStr(task.assignedPerson)]++;
    todaysTask.push(idStr(task.assignedPerson));
    usernameMapping[idStr(task.assignedPerson)] =
      task.assignedPerson.name;
  }
  todaysTask = [...new Set(todaysTask)];

  const tomorrowCounter = {};
  let tomorrowTask = [];
  const taskListTomorrow = await Task.find({
    dueDate: { $gte: startToday, $lte: tomorrowEnd },
  });
  taskId = taskListTomorrow.map((i) => i._id);
  const userTaskListTomorrow = await TaskAssign.find({ taskId })
    .populate({ path: 'account', select: '_id name' })
    .populate({ path: 'assignedPerson', select: '_id name' });

  for (let task of userTaskListTomorrow) {
    if (!tomorrowCounter[idStr(task.account)])
      tomorrowCounter[idStr(task.account)] = 0;
    tomorrowCounter[idStr(task.account)]++;
    tomorrowTask.push(idStr(task.account));
    usernameMapping[idStr(task.account)] = task.account.name;

    if (!tomorrowCounter[idStr(task.assignedPerson)])
      tomorrowCounter[idStr(task.assignedPerson)] = 0;
    tomorrowCounter[idStr(task.assignedPerson)]++;
    tomorrowTask.push(idStr(task.assignedPerson));
    usernameMapping[idStr(task.assignedPerson)] =
      task.assignedPerson.name;
  }
  tomorrowTask = [...new Set(tomorrowTask)];

  await Promise.all(
    tomorrowTask.map(async (account) => {
      if (!todayCounter[account]) todayCounter[account] = 0;
      if (!tomorrowCounter[account]) tomorrowCounter[account] = 0;
      await triggerMessage(account, {
        notification: {
          title: 'Task Reminder',
          body: `You have ${todayCounter[account]} tasks today and ${tomorrowCounter[account]} tasks tomorrow`,
          icon: '',
          data: `/${usernameMapping[account]}/home`,
        },
      });
    }),
  );

  return res.status(200).json({
    todayCounter,
    todaysTask,
    tomorrowCounter,
    tomorrowTask,
  });
};

module.exports = {
  create,
  get,
  update,
  deleteTask,
  list,
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
