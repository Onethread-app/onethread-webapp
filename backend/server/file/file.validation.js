const { isSchema } = require('@hapi/joi');
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

// project id
const pid = Joi.object().keys({
  pid: idSchema.id,
});
const schema = {
  pid: idSchema.id,
  taskId: idSchema.id,
  fileId: idSchema.id,
};

module.exports = {
  fileInProject: Joi.object().keys({
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
  fileInTask: Joi.object().keys({
    body: Joi.object().keys({
      taskId: schema.taskId.required(),
    })
  }),
  fileDeleteInTask: Joi.object().keys({
    body: Joi.object().keys({
      taskId: schema.taskId.required(),
      fileId: schema.fileId.required(),
    })
  }),
};
