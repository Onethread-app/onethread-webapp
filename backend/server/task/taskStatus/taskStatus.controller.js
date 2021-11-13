const TaskStatus = require('./taskStatus.model');
const logger = require('../../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../../helpers/jsonResponse');

const {
  createTaskStatus,
} = require('../../services/task/taskStatus/taskStatus.service');

// load the task-status
const load = async (req, res, next, id) => {
  try {
    const taskStatus = await TaskStatus.findOne({
      _id: id,
      project: req.query.pid,
    });
    if (!taskStatus) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Task Status not found',
      });
    }
    req.taskStatus = taskStatus;
    next();
  } catch (err) {
    logger.error(`Board column: ${err}`);
    next(err);
  }
};

// Create a new task-status in a project
const create = async (req, res, next) => {
  try {
    const uniqueName = await TaskStatus.findOne({
      name: req.body.name,
      project: req.query.pid,
    });
    if (uniqueName) {
      return sendErrorResponse(res, 409, 'DuplicateKeyError', {
        message: 'Task Status already exists',
      });
    }
    const taskStatus = await createTaskStatus(
      req.body.name,
      req.query.pid,
      req.body.positionInBoard,
      req.user._id,
    );
    return sendJSONresponse(res, 201, {
      _id: taskStatus._id,
      name: taskStatus.name,
      positionInBoard: taskStatus.positionInBoard,
    });
  } catch (error) {
    logger.error(`Task Status Creation: ${error}`);
    next(error);
  }
};

// List of task-status of a project
const list = async (req, res, next) => {
  try {
    const { pid } = req.query;
    const listOfStatus = await TaskStatus.find({
      project: pid,
    });
    return sendJSONresponse(res, 200, listOfStatus);
  } catch (err) {
    logger.error(`Board column: ${err}`);
    next(err);
  }
};

// Update a task-status
const update = async (req, res, next) => {
  try {
    const updatedTaskStatus = await TaskStatus.findByIdAndUpdate(
      req.taskStatus._id,
      { $set: req.body },
      { new: true },
    );
    return sendJSONresponse(res, 200, updatedTaskStatus);
  } catch (err) {
    logger.error(`Board column update: ${err}`);
    next(err);
  }
};

module.exports = { load, list, create, update };
