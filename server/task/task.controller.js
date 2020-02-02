const httpStatus = require('http-status');
const Task = require('./task.model');
const BoardColumn = require('./../boardColumn/boardColumn.model');
const ActivityCtrl = require('./../activity/activity.controller');
const logger = require('../../config/winston');
const { APIError, BadRequestError } = require('../helpers/APIError');
const TaskAssign = require('./taskAssign.model');

const load = (req, res, next, id) => {
  Task.findById(id)
    .populate('account', '_id firstName lastName')
    .populate('columnId', '_id name')
    .exec()
    .then(result => {
      if (result) {
        req.task = result;
        return next();
      }
      return res.status(400).json({
        message: 'No valid entry found for provided Task ID',
      });
    })
    .catch(err => {
      next(err);
    });
};

const create = async (req, res, next) => {
  try {
    const task = new Task({
      name: req.body.name,
      // description: req.body.description,
      account: req.user._id,
      columnId: req.body.columnId,
      boardId: req.body.boardId,
    });
    const createdTask = await task.save();

    // TODO: should use update function
    const column = await BoardColumn.findOne({
      _id: req.body.columnId,
    });
    column.tasks.push(createdTask._id);
    await column.save();

    await ActivityCtrl.create(
      `added this card to ${column.name}`,
      'create',
      createdTask._id,
      req.user,
    );

    const responseData = {
      _id: createdTask._id,
      name: createdTask.name,
      description: createdTask.description,
      dueDate: createdTask.dueDate,
    };
    res.status(201).send(responseData);
  } catch (error) {
    logger.error(`Task column create: ${error}`);
    const err = new BadRequestError(
      'task data is invalid.',
      httpStatus.BAD_REQUEST,
    );
    next(err);
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
          populate: [
            {
              path: 'profileImage',
              select: 'link',
            },
          ],
        },
      ])
      .exec()
      .then(result => {
        res.status(200).send(result);
      })
      .catch((error)=>{
        next(error)
      })
};

const addMember = async (req, res, next) => {

    TaskAssign.findOne({
      taskId: req.task._id,
      assignedPerson: req.body.assignedPerson,
    })
      .exec()
      .then(result => {
        if (result) {
          res.status(400).send({
            message: 'Member already exits',
          });
        } else {
          const newTaskMember = new TaskAssign({
            taskId: req.task._id,
            account : req.user._id,
            assignedPerson: req.body.assignedPerson,
          });

          newTaskMember.save().then(taskMember => {
            TaskAssign.find({
              taskId: req.task._id,
            })
              .select('_id assignedPerson account')
              .populate([
                {
                  path: 'assignedPerson account',
                  select: '_id firstName lastName profileImage',
                  populate: [
                    {
                      path: 'profileImage',
                      select: 'link',
                    },
                  ],
                },
              ])
              .exec()
              .then(result => {
                res.status(201).send(result);
              });
          });
        }
      })
      .catch((error)=>{
        next(error)
      })
};

const deleteMember = async (req, res, next) => {
  try {
    await TaskAssign.findByIdAndDelete(req.query.assignedMemberid);
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
    .then(result => {
      res.status(200).send(result);
    })
    .catch(error => {
      next(error);
    });
};

const list = (req, res, next) => {};

const dragTask = async (req, res, next) => {
  try {
    await Task.findByIdAndUpdate(req.body.taskId, {
      $set: { columnId: req.body.destinationColumnId },
    }).exec();

    // TODO: avoid task population
    const sourceColumn = await BoardColumn.findByIdAndUpdate(
      req.body.sourceColumnId,
      { $pull: { tasks: req.body.taskId } },
      { new: true },
    )
      .populate('tasks', '_id name description')
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
      .populate('tasks', '_id name description')
      .exec();

    await ActivityCtrl.create(
      `moved this card from ${sourceColumn.name} to ${destinationColumn.name}`,
      'move',
      req.body.taskId,
      req.user,
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
    const err = new BadRequestError(
      'board column data is invalid.',
      httpStatus.BAD_REQUEST,
    );
    next(err);
  }
};

module.exports = {
  create,
  get,
  update,
  list,
  load,
  dragTask,
  addMember,
  getMembers,
  deleteMember,
};
