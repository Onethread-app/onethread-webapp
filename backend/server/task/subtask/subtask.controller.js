const SubTask = require('./subtask.model');
const { Team } = require('../../team-member/team.model');
const Board = require('../../board/board.model');
const { addToBoard } = require('../../board/board.controller');
const logger = require('../../../config/winston');
const _ = require('lodash');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../../helpers/jsonResponse');
const {
  search,
  accountIndex,
} = require('../../services/elastic.services');
const {
  subTaskAssignNotificationToUsers,
} = require('../../notification/notification.controller');
const {
  createBoardNotification,
} = require('../../notification/notification.controller');
const {
  triggerUnreadNotifications,
} = require('../../services/webpush.services');

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
      .select('_id name done assignedMembers dueDate')
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
    const requestedMember = req.body.assignmember;
    const subTaskId = req.params.subTaskId;
    const boardId = req.body.boardId;

    const subtask = await SubTask.findOne({
      _id: subTaskId,
    });
    const memberAlreadyExistsInSubtask =
      subtask.assignedMembers.filter(
        (assignedMember) => assignedMember._id === requestedMember,
      );

    const board = await Board.findOne({
      _id: boardId,
    });
    const boardMembers = board.members.map((member) =>
      member.toString(),
    );
    const memberAlreadyExistsInBoard =
      boardMembers.includes(requestedMember);

    if (memberAlreadyExistsInSubtask.length > 0) {
      logger.info('Member already exists');
      return sendErrorResponse(res, 409, 'DuplicateKeyError', {
        message: 'Member already exists',
        fieldName: 'name',
      });
    } else {
      if (memberAlreadyExistsInBoard) {
        const subTask = await SubTask.findByIdAndUpdate(
          { _id: subTaskId },
          { $push: { assignedMembers: requestedMember } },
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
        if (req.user._id !== requestedMember) {
          await subTaskAssignNotificationToUsers(
            req.user._id,
            req.headers.companyid,
            subTaskId,
            requestedMember,
            {
              _id: req.user._id,
              name: req.user.name,
              pusherSock: req.headers.clientid,
            },
          );
          await triggerUnreadNotifications(requestedMember);
        }
        return sendJSONresponse(res, 201, subTask);
      } else {
        await addToBoard(boardId, requestedMember);
        const subTask = await SubTask.findByIdAndUpdate(
          { _id: subTaskId },
          { $push: { assignedMembers: requestedMember } },
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
        if (req.user._id !== requestedMember) {
          await subTaskAssignNotificationToUsers(
            req.user._id,
            req.headers.companyid,
            subTaskId,
            requestedMember,
            {
              _id: req.user._id,
              name: req.user.name,
              pusherSock: req.headers.clientid,
            },
          );
          await triggerUnreadNotifications(requestedMember);
        }
        return sendJSONresponse(res, 201, subTask);
      }
    }
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
    const subTaskId = req.params.subTaskId;

    let subTaskMembers = await SubTask.findById(subTaskId)
      .select('_id assignedMembers')
      .exec();

    let projectMembers = await Team.find({
      project: req.query.pid,
    })
      .select('_id account')
      .populate('account', '_id name')
      .exec();

    let members = projectMembers.filter(({ account }) => {
      return !subTaskMembers.assignedMembers.includes(account._id);
    });

    members = members.map((m) => m.account);

    return sendJSONresponse(res, 200, {
      success: true,
      message: `Suggested members for ${subTaskId}`,
      data: members,
    });
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
