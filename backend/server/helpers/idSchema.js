const Joi = require('@hapi/joi');

// id
const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(() => {
      return {
        message: 'Invalid ID',
      };
    }),
};

module.exports = {
  idSchema,
};
