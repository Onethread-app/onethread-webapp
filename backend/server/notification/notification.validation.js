const Joi = require('@hapi/joi');

const idSchema = {
  id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
};

module.exports = {
  markAllAsRead: Joi.object().keys({
    body: Joi.object().keys({
      list: Joi.array().items(idSchema.id),
    }),
  }),
};
