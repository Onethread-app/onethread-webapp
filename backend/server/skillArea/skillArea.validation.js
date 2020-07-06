const Joi = require('@hapi/joi');

const schema = {
  name: Joi.string().trim().lowercase().min(1).max(80),
};
module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
    }),
  }),

  update: Joi.object().keys({
    body: Joi.object().keys({
      skillArea: Joi.string().error((error) => {
        return { success: false, message: `must provide skillId` };
      }),
    }),
  }),
  search: Joi.object().keys({
    name: Joi.string()
      .min(1)
      .max(80)
      .error((err) => {
        return { message: 'please check the query parameter' };
      }),
  }),
};
