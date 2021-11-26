const Comment = require('./comment.model');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const TaskAssign = require('../task/taskAssign.model');
const {
  notifyToTaskMember,
} = require('../notification/notification.controller');

const Task = require('../task/task.model');

const { removeDuplicateFromArray } = require('../helpers/utils');

const load = async (req, res, next, id) => {
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'No valid entry found for provided ID',
      });
    }
    req.comment = comment;
    next();
  } catch (error) {
    logger.error(`Comment: ${error}`);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const task = await Task.findById(req.body.taskId);
    if (!task) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'task not found for provided ID',
      });
    }

    const comment = await Comment.create({
      text: req.body.text,
      account: req.user._id,
      taskId: req.body.taskId,
    });

    const subtasks = await Task.find({
      parentTask: req.body.taskId,
    }).select('_id');

    // All Task = SubTaskId
    let allTaskIds = subtasks.map((st) => st._id.toString());
    // All Task += taskId
    allTaskIds.push(req.body.taskId);

    const result = comment;

    let taskMembers = await TaskAssign.find({
      taskId: allTaskIds,
    })
      .select('assignedPerson')
      .populate('assignedPerson taskId', '_id account');
    let memberList = [];
    let taskAssignMembers = taskMembers.map(
      (task) => task.assignedPerson,
    );
    memberList = taskAssignMembers.map((task) => task._id.toString());

    if (taskMembers.length === 0) {
      return sendJSONresponse(res, 201, result);
    }
    memberList.push(task.account.toString());
    memberList = removeDuplicateFromArray(memberList);
    memberList.map(async (member) => {
      if (member !== req.user._id) {
        await notifyToTaskMember(
          req.user._id,
          req.headers.companyid,
          req.body.taskId,
          {
            _id: req.user._id,
            name: req.user.name,
            pusherSock: req.headers.clientid,
          },
          member,
        );
        logger.info(`successfully notify to user`);
      }
    });
    return sendJSONresponse(res, 201, result);
  } catch (error) {
    logger.error(`comment: ${error}`);
    next(error);
  }
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const comments = await Comment.find({ taskId: req.query.taskId })
      .select('_id text account createdAt')
      .populate([
        {
          path: 'account',
          select: '_id firstName lastName profileImage position',
        },
      ])
      .sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit);

    return sendJSONresponse(res, 200, comments);
  } catch (error) {
    logger.error(`Comment - List: ${error}`);
    next(error);
  }
};

module.exports = {
  load,
  create,
  list,
};
