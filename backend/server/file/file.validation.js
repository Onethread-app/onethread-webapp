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

const schema = {
  pid: idSchema.id,
};

module.exports = {
  fileInProject: Joi.object().keys({
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
};
