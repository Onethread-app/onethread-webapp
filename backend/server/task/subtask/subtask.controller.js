const httpStatus = require('http-status');
const SubTask = require('./subtask.model');
const logger = require('../../../config/winston');
const {
  APIError,
  BadRequestError,
} = require('../../helpers/APIError');

const load = (req, res, next, id) => {
  SubTask.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        req.SubTask = result;
        return next();
      }
      return res.status(400).json({
        message: 'No valid entry found for provided SubTask ID',
      });
    })
    .catch((err) => {
      next(err);
    });
};

//create a new subtask

const create = async (req, res, next) => {
  try {
    const subTask = new SubTask({
      name: req.body.name,
      account: req.user._id,
      taskId: req.body.taskId,
    });

    const createdSubTask = await subTask.save();
    res.status(201).send(createdSubTask);
  } catch (error) {
    logger.error(`SubTask create: ${error}`);
    next(error);
  }
};

const get = (req, res, next) => {
  return res.json(req.subTask);
};

const update = async (req, res, next) => {
  try {
    const newSubTask = await SubTask.findByIdAndUpdate(
      { _id: req.SubTask._id },
      req.body,
      { new: true },
    );
    res.status(200).send(newSubTask);
  } catch (error) {
    next(error);
  }
};

const deleteSubtask = async (req, res, next) => {
  try {
    await SubTask.findByIdAndDelete(req.SubTask._id);
    res.status(200).json({ message: 'SUBTASK DELETED' });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0, taskId } = req.query;

  await SubTask.find({
    taskId: taskId,
  })
    .select('_id name done ')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      logger.info(`${result}`);
      res.status(200).send(result);
    })
    .catch((e) => next(e));
};
module.exports = { create, load, list, get, update, deleteSubtask };
