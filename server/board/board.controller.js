const httpStatus = require('http-status');
const Board = require('./board.model');
const BoardColumn = require('./../boardColumn/boardColumn.model');
const logger = require('../../config/winston');
const { APIError, BadRequestError } = require('../helpers/APIError');

const load = (req, res, next, id) => {
  Board.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.board = result;
        return next();
      }
      return res.status(400).json({
        message: 'No valid entry found for provided Board ID',
      });
    })
    .catch(err => {
      next(err);
    });
};

const get = async (req, res) => {
  const boardObj = await Board.findById(req.board._id)
    .exec()
    .then(result => result)
    .catch(err => {
      next(err);
    });
  await BoardColumn.find({
    boardId: req.board._id,
    removed: false,
  })
    .select('_id name tasks positionInBoard')
    .populate('tasks', '_id name description')
    .exec()
    .then(colResult => {
      const responseResult = {
        _id: boardObj._id,
        name: boardObj.name,
        description: boardObj.description,
        members: boardObj.members,
        columns: colResult,
      };
      res.json(responseResult);
    })
    .catch(e => next(e));
};

const create = async (req, res, next) => {
  try {
    const board = new Board({
      name: req.body.name,
      description: req.body.description,
      account: req.user._id,
      company: req.body.companyId,
    });
    board
      .save()
      .then(createdBoard => res.status(201).json(createdBoard))
      .catch(e => next(e));
  } catch (error) {
    logger.error(`Board create: ${error}`);
    const err = new BadRequestError(
      'board data is invalid.',
      httpStatus.BAD_REQUEST,
    );
    next(err);
  }
};

const update = (req, res, next) => {};

const addBoardMembers = (req, res, next) => {};

const addBoardColumn = (req, res, next) => {};

const list = (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;
  Board.find({
    $or: [
      { account: req.user },
      { members: { $elemMatch: { _id: req.user } } },
    ],
    company: companyId,
    removed: false,
  })
    .select('_id name description')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => {
      res.json(result);
    })
    .catch(e => next(e));
};

const remove = (req, res, next) => {
  const board = req.board;
  // remove task
  // remove column
  // remove board
};

const suggestMember = async (req, res, next) => {
  try {
    let boardMembers = await Board.findById(req.params.boardId)
      .select('-_id members')
      .populate('members', '_id name')
      .exec();

    let companyMembers = await Member.find({
      company: req.body.companyId,
    })
      .select('-_id account')
      .populate('account', '_id name')
      .exec();

    let members = companyMembers.filter(({ account }) => {
      return !boardMembers.members.some(existingMember => {
        return (
          existingMember._id.toString() === account._id.toString()
        );
      });
    });
    members = members.map(m => m.account);

    return res.status(200).json({
      members,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  load,
  get,
  create,
  list,
  remove,
  update,
  addBoardMembers,
  addBoardColumn,
  suggestMember,
};
