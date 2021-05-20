const httpStatus = require('http-status');
const SubTask = require('./subtask.model');
const logger = require('../../../config/winston');
const {
  APIError,
  BadRequestError,
} = require('../../helpers/APIError');
const { sendJSONresponse } = require('../../helpers/jsonResponse');

const {
  search,
  accountIndex,
} = require('../../services/elastic.services');

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
  try {
    const { limit = 50, skip = 0, taskId } = req.query;

    const subtasks = await SubTask.find({
      taskId: taskId,
    })
      .select('_id name done assignedMembers')
      .populate([
        {
          path: 'assignedMembers',
          select: '_id firstName lastName profileImage',
        },
      ])
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
    return sendJSONresponse(res, 200, subtasks);
  } catch (error) {
    logger.error(`Subtask: ${error}`);
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const requestedMembers = req.body.assignmember;
    const subTaskId = req.params.subTaskId;
    //TODOs: need to check if user already added in thsi subtask
    const subTask = await SubTask.findByIdAndUpdate(
      { _id: subTaskId },
      { $push: { assignedMembers: requestedMembers } },
      { safe: true, upsert: true, new: true },
    )
      .select('_id assignedMembers')
      .populate([
        {
          path: 'assignedMembers',
          select: '_id firstName lastName profileImage',
        },
      ])
      .exec();

    return sendJSONresponse(res, 201, subTask);
  } catch (error) {
    logger.error(`Subtask: ${error}`);
    next(error);
  }
};

const getMembers = (req, res, next) => {
  try {
    SubTask.find({
      _id: req.params.subTaskId,
    })
      .select('_id assignedMembers')
      .populate([
        {
          path: 'assignedMembers',
          select: '_id firstName lastName profileImage',
        },
      ])
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result);
      });
  } catch (error) {
    logger.error(`Subtask: ${error}`);
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const memberId = req.query.memberId;
    const subTaskId = req.params.subTaskId;
    let doesExist = false;

    const subTask = await SubTask.findOne({
      _id: subTaskId,
    })
      .select('assignedMembers')
      .populate([
        {
          path: 'assignedMembers',
          select: '_id',
        },
      ])
      .exec();

    subTask.assignedMembers.map((assignedMember) => {
      if (assignedMember._id.toString() === memberId) {
        doesExist = true;
      }
    });

    if (doesExist) {
      await SubTask.findByIdAndUpdate(
        { _id: subTaskId },
        { $pull: { assignedMembers: memberId } },
        { safe: true, upsert: true, new: true },
      )
        .select('_id assignedMembers')
        .populate([
          {
            path: 'assignedMembers',
            select: '_id firstName lastName profileImage',
          },
        ])
        .exec()
        .then((result) => {
          return sendJSONresponse(res, 200, result);
        });
    } else {
      return sendJSONresponse(res, 404, {
        message: 'ID does not exist',
        status: 404,
      });
    }
  } catch (error) {
    logger.error(`Subtask: ${error}`);
    next(error);
  }
};

const searchMember = async (req, res, next) => {
  try {
    const name = req.query.name;
    const subTaskId = req.params.subTaskId;

    const subTask = await SubTask.findById(subTaskId).exec();

    if (name) {
      let body = {
        size: 200,
        from: 0,
        query: {
          bool:
            subTask.assignedMembers.length > 0
              ? {
                  must: [
                    {
                      multi_match: {
                        query: req.query.name,
                        type: 'phrase_prefix',
                        fields: [
                          'email',
                          'firstName',
                          'lastName',
                          'name',
                        ],
                      },
                    },
                  ],
                  must_not: [
                    {
                      terms: {
                        mongo_id: subTask.assignedMembers,
                      },
                    },
                  ],
                }
              : {
                  must: [
                    {
                      multi_match: {
                        query: req.query.name,
                        type: 'phrase_prefix',
                        fields: [
                          'email',
                          'firstName',
                          'lastName',
                          'name',
                        ],
                      },
                    },
                  ],
                },
        },
      };

      const response = await search(accountIndex, '_doc', body);
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
    logger.error(`Subtask: ${error}`);
    next(error);
  }
};

module.exports = {
  create,
  load,
  list,
  get,
  update,
  deleteSubtask,
  addMember,
  getMembers,
  deleteMember,
  searchMember,
};
