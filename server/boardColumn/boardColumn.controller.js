const BoardColumn = require('./boardColumn.model');
const logger = require('../../config/winston');
const {
  APIError,
  BadRequestError
} = require('../helpers/APIError');

const load = async (req, res, next, id) => {
  await BoardColumn.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.boardColumn = result;
        return next();
      }
      return res.status(400).json({ message: "No valid entry found for provided Board ID" })
    }).catch(err => {
      next(err);
    });
}

const create = async (req, res, next) => {
  try {
    const boardColumn = new BoardColumn({
      name: req.body.name,
      positionInBoard: req.body.positionInBoard,
      boardId: req.body.boardId
    });
    await boardColumn.save()
      .then(createdColumn => {
        const resposneObj = {
          _id: createdColumn._id,
          name: createdColumn.name,
          positionInBoard: createdColumn.positionInBoard,
          tasks: createdColumn.tasks
        }
        res.status(201).send(resposneObj)
      })
      .catch(e => next(e));
  } catch (error) {
    logger.error(`Board column create: ${error}`);
    const err = new BadRequestError('board column data is invalid.', httpStatus.BAD_REQUEST)
    next(err);
  }
}

const list = async (req, res, next) => {
  const { limit = 50, skip = 0, boardId } = req.query;
  await BoardColumn.find({
    boardId: boardId,
    removed: false
  })
    // .populate('tasks')
    .exec()
    .then(result => res.status(200).send(result))
    .catch(e => next(e));
}

const update = (req, res, next) => {
  BoardColumn.findByIdAndUpdate(
    req.boardColumn._id,
    { $set: req.body },
    { "new": true },
    (error, updatedColumn) => {
      if (error) {
        logger.error(`Board column update: ${error}`);
        const err = new BadRequestError('board column updated data is invalid.', httpStatus.BAD_REQUEST)
        next(err);
      }
      return res.status(200).send(updatedColumn);
    });
}

module.exports = { load, list, create, update }