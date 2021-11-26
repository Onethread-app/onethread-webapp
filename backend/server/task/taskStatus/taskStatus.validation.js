const Joi = require('@hapi/joi');

const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error((errors) => {
      return {
        message: 'Invalid ID',
      };
    }),
};

const taskStautsSchema = {
  name: Joi.string(),
  positionInBoard: Joi.number(),
  project: idSchema.id,
};

module.exports = {
  createTaskStatus: Joi.object().keys({
    body: Joi.object().keys({
      name: taskStautsSchema.name.required(),
      positionInBoard: taskStautsSchema.positionInBoard.required(),
    }),
    query: Joi.object().keys({
      pid: taskStautsSchema.project.required(),
    }),
  }),
  updateTaskStatus: Joi.object().keys({
    body: Joi.object().keys({
      name: taskStautsSchema.name.required(),
      positionInBoard: taskStautsSchema.positionInBoard.required(),
    }),
    query: Joi.object().keys({
      pid: taskStautsSchema.project.required(),
    }),
  }),
};
