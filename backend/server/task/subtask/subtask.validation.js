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

const subTaskId = Joi.object().keys({
  subTaskId: idSchema.id.required(),
});

const subTaskSchema = {
  name: Joi.string(),
  description: Joi.string(),
  done: Joi.boolean(),
  taskId: idSchema.id,
  dueDate: Joi.date(),
};

module.exports = {
  createSubTask: Joi.object().keys({
    body: Joi.object().keys({
      name: subTaskSchema.name.required(),
      description: subTaskSchema.description,
      taskId: subTaskSchema.taskId.required(),
    }),
  }),
  updateSubTask: Joi.object().keys({
    body: Joi.object().keys({
      done: subTaskSchema.done,
      name: subTaskSchema.name,
      description: subTaskSchema.description,
      dueDate: subTaskSchema.dueDate,
    }),
    params: subTaskId,
  }),
  deleteSubtask: Joi.object().keys({
    params: subTaskId,
  }),
  addMember: Joi.object().keys({
    body: Joi.object().keys({
      assignmember: idSchema.id.required(),
      boardId: idSchema.id.required(),
    }),
    params: subTaskId,
  }),
  searchMember: Joi.object().keys({
    params: subTaskId,
  }),
  deleteMember: Joi.object().keys({
    params: subTaskId,
  }),
};
