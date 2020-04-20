const Joi = require('joi');

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

const taskId = Joi.object().keys({
  taskId: idSchema.id.required(),
});

const taskSchema = {
  name: Joi.string(),
  description: Joi.string(),
  priority: Joi.number(),
  account: idSchema.id,
  dueDate: Joi.date(),
  comments: Joi.array().items(idSchema.id),
  columnId: idSchema.id,
  boardId: idSchema.id,
};

module.exports = {
  createTask: Joi.object().keys({
    body: Joi.object().keys({
      name: taskSchema.name.required(),
      // description: taskSchema.description.allow(''),
      columnId: taskSchema.columnId.required(),
      boardId: taskSchema.boardId.required(),
    }),
  }),
  dragTask: Joi.object().keys({
    body: Joi.object().keys({
      taskId: Joi.string().required(),
      sourceColumnId: Joi.string().required(),
      destinationColumnId: Joi.string().required(),
      taskIndexOfDestinationColumn: Joi.number().required(),
    }),
  }),
  updateTask: Joi.object().keys({
    body: Joi.object().keys({
      name: taskSchema.name,
      description: taskSchema.description.allow(''),
      dueDate: taskSchema.dueDate,
      priority: taskSchema.priority,
    }),
  }),
  addMember: Joi.object().keys({
    body: Joi.object().keys({
      assignmembers: Joi.array().items(idSchema.id).required(),
    }),
    params: taskId,
  }),
  deleteMember: Joi.object().keys({
    params: taskId,
  }),
};
