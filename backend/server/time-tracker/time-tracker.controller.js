const TimeTracker = require('./time-tracker.model');
const Task = require('../task/task.model');
const { Project } = require('../project/project.model');

const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');

const populateArray = [
  {
    path: 'task',
    select: '_id name parentTask status project company account',
    populate: [
      {
        path: 'status',
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
    ],
  },
];
const sortObject = { startTime: -1 };
const selectString = '_id startTime duration task';

const create = async (req, res, next) => {
  try {
    const { startTime, duration, task } = req.body;
    const { pid } = req.query;

    const timeTracker = await TimeTracker.create({
      account: req.user._id,
      startTime,
      duration,
      task,
    });

    await Task.findByIdAndUpdate(
      task,
      { $inc: { timeSpent: duration } },
      { new: true },
    );

    await Project.findByIdAndUpdate(
      pid,
      { $inc: { timeSpent: duration } },
      { new: true },
    );

    await timeTracker.populate(populateArray);
    return sendJSONresponse(res, 201, { timeTracker });
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
      .populate(populateArray)
      .sort(sortObject);

    return sendJSONresponse(res, 200, trackedTime);
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

const findByTask = async (req, res, next) => {
  try {
    const timeTrackers = await TimeTracker.find({
      task: req.params.task,
    })
      .select(selectString)
      .populate(populateArray)
      .sort(sortObject);

    return sendJSONresponse(res, 200, timeTrackers);
  } catch (error) {
    logger.error(`Time Tracker: ${error}`);
    next(error);
  }
};

module.exports = {
  create,
  findByuser,
  findByTask,
};
