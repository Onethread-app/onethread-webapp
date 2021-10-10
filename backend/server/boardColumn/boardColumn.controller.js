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
      if (result.project === req.query.pid) {
        req.boardColumn = result;
        next();
      } else {
        return sendErrorResponse(res, 400, 'ValidationError', {
          message: 'Project ID mismatch',
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
    const uniqueName = await BoardColumn.findOne({
      name: req.body.name,
      boardId: req.body.boardId,
    });
    if (uniqueName) {
      return sendErrorResponse(res, 409, 'DuplicateKeyError', {
        message: 'Column name already exists',
      });
    }
    const boardColumn = new BoardColumn({
      name: req.body.name,
      type: req.body.type,
      project: req.query.pid,
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
        logger.error(`Board column: ${e}`);
        next(e);
      });
  } catch (error) {
    logger.error(`Board column: ${error}`);
    next(error);
  }
};

const list = async (req, res, next) => {
  const { boardId, pid } = req.query;
  await BoardColumn.find({
    boardId: boardId,
    removed: false,
  })
    .exec()
    .then((result) => {
      if (result.project === pid) {
        return sendJSONresponse(res, 200, result);
      } else {
        return sendErrorResponse(res, 400, 'ValidationError', {
          message: 'Project ID mismatch',
        });
      }
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
