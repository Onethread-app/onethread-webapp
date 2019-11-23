const Joi = require('joi');

// id
const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(errors => {
      return {
        message: 'Invalid ID',
      };
    }),
};

const taskSchema = {
  name: Joi.string(),
  description: Joi.string(),
  priority: Joi.string(),
  assignedPersons: Joi.array().items(idSchema.id),
  account: idSchema.id,
  dueDate: Joi.date(),
  comments: Joi.array().items(idSchema.id),
  columnId: idSchema.id,
  boardId: idSchema.id
}

module.exports = {
  createTask: Joi.object().keys({
    body: Joi.object().keys({
      name: taskSchema.name.required(),
      description: taskSchema.description.allow(''),
      columnId: taskSchema.columnId.required(),
      boardId: taskSchema.boardId.required()
    }),
  }),
  dragTask: Joi.object().keys({
    body: Joi.object().keys({
      taskId: Joi.string().required(),
      sourceColumnId: Joi.string().required(),
      destinationColumnId: Joi.string().required(),
      taskIndexOfDestinationColumn: Joi.number().required()
    }),
  }),
  // updateTask: Joi.object().keys({
  //   body: Joi.object().keys({
      
  //   })
  // })
}