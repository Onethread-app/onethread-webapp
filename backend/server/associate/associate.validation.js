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

module.exports = {
  createAssociate: Joi.object().keys({
    body: Joi.object().keys({
      associateCompanyId: idSchema.id.required(),
    }),
  }),
  acceptPending: Joi.object().keys({
    body: Joi.object().keys({
      associates: Joi.array().items(idSchema.id).min(1).required(),
    }),
  }),
  rejectPending: Joi.object().keys({
    body: Joi.object().keys({
      associates: Joi.array().items(idSchema.id).min(1).required(),
    }),
  }),
};
