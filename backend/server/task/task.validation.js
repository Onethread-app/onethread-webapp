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
const taskSchema = {
  name: Joi.string(),
  description: Joi.string(),
  status: idSchema.id,
  priority: Joi.number(),
  account: idSchema.id,
  project: idSchema.id,
  dueDate: Joi.date(),
  comments: Joi.array().items(idSchema.id),
  columnId: idSchema.id,
  boardId: idSchema.id,
  taskId: idSchema.id,
  isCompleted: Joi.boolean(),
};
module.exports = {
  createTask: Joi.object().keys({
    body: Joi.object().keys({
      name: taskSchema.name.required(),
      description: taskSchema.description.allow(''),
      dueDate: taskSchema.dueDate.required(),
      priority: taskSchema.priority.required(),
      assignmembers: Joi.array().items().required(),
      status: taskSchema.status.required(),
      labels: Joi.array().items(idSchema.id).required(),
    }),

    query: Joi.object().keys({
      pid: taskSchema.project.required(),
    }),
  }),

  deleteTask: Joi.object().keys({
    body: Joi.object().keys({
      tasks: Joi.array().items(idSchema.id).required(),
    }),
  }),

  createSubtask: Joi.object().keys({
    body: Joi.object().keys({
      name: taskSchema.name.required(),
      description: taskSchema.description,
    }),
  }),
  dragTask: Joi.object().keys({
    body: Joi.object().keys({
      taskId: Joi.string().required(),
      sourceStatusId: Joi.string().required(),
      destinationStatusId: Joi.string().required(),
    }),
  }),
  updateTask: Joi.object().keys({
    body: Joi.object().keys({
      name: taskSchema.name,
      description: taskSchema.description.allow(''),
      dueDate: taskSchema.dueDate,
      priority: taskSchema.priority,
      status: taskSchema.status,
      isCompleted: taskSchema.isCompleted,
    }),
  }),
  addMember: Joi.object().keys({
    body: Joi.object().keys({
      assignmembers: Joi.array().items(idSchema.id).required(),
    }),
    params: Joi.object().keys({
      taskId: taskSchema.taskId,
    }),
  }),
  deleteMember: Joi.object().keys({
    params: Joi.object().keys({
      taskId: taskSchema.taskId,
    }),
    query: Joi.object().keys({
      pid: taskSchema.project.required(),
      assignedMemberid: idSchema.id.required(),
    }),
  }),
  markAsCompleted: Joi.object().keys({
    body: Joi.object().keys({
      task: Joi.array()
        .items({
          _id: idSchema.id.required(),
          pid: idSchema.id.required(),
        })
        .min(1)
        .required(),
    }),
  }),
};
