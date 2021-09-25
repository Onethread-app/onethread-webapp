const TimeTracker = require('./time-tracker.model');
const Task = require('../task/task.model');
const Subtask = require('../task/subtask/subtask.model');
const { Project } = require('../project/project.model');

const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');

const ttPopulateOptions = [
  {
    path: 'task',
    select: '_id name boardId',
    populate: [
      {
        path: 'boardId',
        select: '_id',
      },
    ],
  },
  {
    path: 'subtask',
    select: '_id name',
  },
  {
    path: 'column',
    select: '_id name',
  },
  {
    path: 'project',
    select: '_id name',
  },
  {
    path: 'company',
    select: '_id name uniqueName',
  },
  {
    path: 'account',
    select: '_id firstName lastName name profileImage',
  },
];

const create = async (req, res, next) => {
  try {
    const {
      startTime,
      duration,
      task,
      subtask,
      column,
      project,
      company,
    } = req.body;

    const timeTracker = new TimeTracker({
      account: req.user._id,
      startTime,
      duration,
      task,
      subtask,
      column,
      project,
      company,
    });
    await timeTracker.save();

    if (subtask) {
      await Subtask.findByIdAndUpdate(
        subtask,
        {
          $inc: { timeSpent: duration },
        },
        { new: true },
      );
    }

    await Task.findByIdAndUpdate(
      task,
      {
        $inc: { timeSpent: duration },
      },
      { new: true },
    );

    await Project.findByIdAndUpdate(
      project,
      {
        $inc: { timeSpent: duration },
      },
      { new: true },
    );

    sendJSONresponse(res, 200, {
      timeTracker,
    });
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

const findByuser = async (req, res, next) => {
  try {
    const trackedTime = await TimeTracker.find({
      account: req.user._id,
    })
      .populate(ttPopulateOptions)
      .sort({ startTime: -1 })
      .exec();
    sendJSONresponse(res, 200, trackedTime);
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

const findByTask = async (req, res, next) => {
  try {
    const timeTrackers = await TimeTracker.find({
      task: req.query.taskId,
    })
      .select(
        '_id startTime duration task subtask column project company',
      )
      .populate(ttPopulateOptions)
      .sort({ startTime: -1 })
      .exec();
    sendJSONresponse(res, 200, timeTrackers);
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

const findBySubtask = async (req, res, next) => {
  try {
    const timeTrackers = await TimeTracker.find({
      subtask: req.query.subtaskId,
    })
      .select(
        '_id startTime duration task subtask column project company',
      )
      .populate(ttPopulateOptions)
      .sort({ startTime: -1 })
      .exec();
    sendJSONresponse(res, 200, timeTrackers);
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

const findByProject = async (req, res, next) => {
  try {
    const timeTrackers = await TimeTracker.find({
      project: req.query.projectId,
    })
      .select(
        '_id startTime duration task subtask column project company',
      )
      .populate(ttPopulateOptions)
      .sort({ startTime: -1 })
      .exec();
    sendJSONresponse(res, 200, timeTrackers);
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

const findByCompany = async (req, res, next) => {
  try {
    const timeTrackers = await TimeTracker.find({
      project: req.query.projectId,
    })
      .select(
        '_id startTime duration task subtask column project company',
      )
      .populate(ttPopulateOptions)
      .sort({ startTime: -1 })
      .exec();
    sendJSONresponse(res, 200, timeTrackers);
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

module.exports = {
  create,
  findByuser,
  findByTask,
  findBySubtask,
  findByProject,
  findByCompany,
};
