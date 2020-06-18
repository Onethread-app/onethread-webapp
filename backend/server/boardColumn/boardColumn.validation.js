const Joi = require('@hapi/joi');

// id
const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error((errors) => {
      return {
        message: 'Invalid ID',
      };
    }),
};

const boardColumnSchema = {
  name: Joi.string(),
  taskIds: Joi.array().items(idSchema.id),
  boardId: idSchema.id,
  positionInBoard: Joi.number(),
  removed: Joi.boolean(),
};

module.exports = {
  createBoardColumn: Joi.object().keys({
    body: Joi.object().keys({
      name: boardColumnSchema.name.required(),
      positionInBoard: boardColumnSchema.positionInBoard.required(),
      boardId: boardColumnSchema.boardId.required(),
    }),
  }),
  updateBoardColumn: Joi.object().keys({
    body: Joi.object().keys({
      name: boardColumnSchema.name.required(),
      positionInBoard: boardColumnSchema.positionInBoard.required(),
      boardId: boardColumnSchema.boardId.required(),
    }),
  }),
};
