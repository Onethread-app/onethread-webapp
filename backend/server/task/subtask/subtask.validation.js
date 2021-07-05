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
  done: Joi.boolean(),
  taskId: idSchema.id,
};

module.exports = {
  createSubTask: Joi.object().keys({
    body: Joi.object().keys({
      name: subTaskSchema.name.required(),
      taskId: subTaskSchema.taskId.required(),
    }),
  }),
  updateSubTask: Joi.object().keys({
    body: Joi.object().keys({
      done: subTaskSchema.done,
      name: subTaskSchema.name,
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
