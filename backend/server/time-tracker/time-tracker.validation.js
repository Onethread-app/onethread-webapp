const Joi = require('@hapi/joi');

const { idSchema } = require('../helpers/idSchema');

const timeTrackerSchema = {
  start_time: Joi.date(),
  duration: Joi.number(),
  account: idSchema.id,
  task: idSchema.id,
  subtask: idSchema.id,
  column: idSchema.id,
  project: idSchema.id,
  company: idSchema.id,
};

module.exports = {
  createTimeTracker: Joi.object().keys({
    body: Joi.object().keys({
      start_time: timeTrackerSchema.start_time.required(),
      duration: timeTrackerSchema.duration.required(),
      task: timeTrackerSchema.task.required(),
      subtask: timeTrackerSchema.subtask,
      column: timeTrackerSchema.column.required(),
      project: timeTrackerSchema.project.required(),
      company: timeTrackerSchema.company.required(),
    }),
  }),
  findByTask: Joi.object().keys({
    query: Joi.object().keys({
      taskId: timeTrackerSchema.task.required(),
    }),
  }),
  findBySubtask: Joi.object().keys({
    query: Joi.object().keys({
      subtaskId: timeTrackerSchema.subtask.required(),
    }),
  }),
  findByProject: Joi.object().keys({
    query: Joi.object().keys({
      projectId: timeTrackerSchema.project.required(),
    }),
  }),
  findByCompany: Joi.object().keys({
    query: Joi.object().keys({
      companyId: timeTrackerSchema.project.required(),
    }),
  }),
  findByUser: Joi.object().keys({
    query: Joi.object().keys({
      userId: timeTrackerSchema.account.required(),
    }),
  }),
};
