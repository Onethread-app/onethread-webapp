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

// TODO: Strong Validation
const labelSchema = {
  name: Joi.string(),
  color: Joi.string(),
  description: Joi.string(),
  task: idSchema.id,
  label: idSchema.id,
  keyword: Joi.string(),
  taskLabel: idSchema.id,
};

module.exports = {
  createLabel: Joi.object().keys({
    body: Joi.object().keys({
      name: labelSchema.name.required(),
      color: labelSchema.color.required(),
      description: labelSchema.description,
      task: labelSchema.task.required(),
    }),
  }),
  createForCompany: Joi.object().keys({
    body: Joi.object().keys({
      name: labelSchema.name.required(),
      color: labelSchema.color.required(),
      description: labelSchema.description,
    }),
  }),
  suggestLabel: Joi.object().keys({
    query: Joi.object().keys({
      keyword: labelSchema.keyword.required(),
    }),
  }),
  createTaskLabel: Joi.object().keys({
    body: Joi.object().keys({
      label: labelSchema.label,
    }),
    params: Joi.object().keys({
      task: labelSchema.task,
    }),
  }),
  getTaskLabel: Joi.object().keys({
    params: Joi.object().keys({
      task: labelSchema.task,
    }),
  }),
  deleteLabel: Joi.object().keys({
    params: Joi.object().keys({
      taskLabel: labelSchema.taskLabel,
    }),
  }),
};
