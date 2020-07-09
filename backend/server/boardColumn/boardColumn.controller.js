const BoardColumn = require('./boardColumn.model');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const load = async (req, res, next, id) => {
  await BoardColumn.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        req.boardColumn = result;
        next();
      } else {
        return sendErrorResponse(res, 400, 'IdIsNotExits', {
          message: 'No valid entry found for provided Board ID',
        });
      }
    })
    .catch((err) => {
      logger.error(`Board column: ${err}`);
      next(err);
    });
};

const create = async (req, res, next) => {
  try {
    const boardColumn = new BoardColumn({
      name: req.body.name,
      positionInBoard: req.body.positionInBoard,
      boardId: req.body.boardId,
      account: req.user._id,
    });
    await boardColumn
      .save()
      .then((createdColumn) => {
        const resposneObj = {
          _id: createdColumn._id,
          name: createdColumn.name,
          positionInBoard: createdColumn.positionInBoard,
          tasks: createdColumn.tasks,
        };
        return sendJSONresponse(res, 201, resposneObj);
      })
      .catch((e) => {
        logger.error(`Board column: ${err}`);
        next(e);
      });
  } catch (error) {
    logger.error(`Board column: ${error}`);
    next(error);
  }
};

const list = async (req, res, next) => {
  const { boardId } = req.query;
  await BoardColumn.find({
    boardId: boardId,
    removed: false,
  })
    .exec()
    .then((result) => {
      return sendJSONresponse(res, 200, result);
    })
    .catch((e) => {
      logger.error(`Board column: ${err}`);
      next(e);
    });
};

const update = (req, res, next) => {
  BoardColumn.findByIdAndUpdate(
    req.boardColumn._id,
    { $set: req.body },
    { new: true },
    (error, updatedColumn) => {
      if (error) {
        logger.error(`Board column update: ${error}`);
        next(err);
      }
      return sendJSONresponse(res, 200, updatedColumn);
    },
  );
};

module.exports = { load, list, create, update };
