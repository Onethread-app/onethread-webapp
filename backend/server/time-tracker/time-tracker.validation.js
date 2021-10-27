const Joi = require('@hapi/joi');
const { idSchema } = require('../helpers/idSchema');

const timeTrackerSchema = {
  startTime: Joi.date(),
  duration: Joi.number(),
  task: idSchema.id,
  project: idSchema.id,
};

module.exports = {
  createTimeTracker: Joi.object().keys({
    body: Joi.object().keys({
      startTime: timeTrackerSchema.startTime.required(),
      duration: timeTrackerSchema.duration.required(),
      task: timeTrackerSchema.task.required(),
    }),
    query: Joi.object().keys({
      pid: timeTrackerSchema.project.required(),
    }),
  }),
  findByProject: Joi.object().keys({
    query: Joi.object().keys({
      pid: timeTrackerSchema.project.required(),
    }),
  }),
  findByTask: Joi.object().keys({
    params: Joi.object().keys({
      task: timeTrackerSchema.task.required(),
    }),
  }),
};
