const Joi = require('joi');

// id
const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(errors => {
      return {
        message: 'Invalid ID',
      };
    }),
};

// joi schema
const schema = {
  account: idSchema.id,
  room: idSchema.id,
  text: Joi.string(),
  type: Joi.string()
    .valid(['text', 'url', 'file'])
    .default('text'),
};

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      text: schema.text.required(),
      type: schema.type,
      room: schema.room.required(),
    }),
  }),
  getRoomMessages: Joi.object().keys({
    params: Joi.object().keys({
      roomId: schema.room.required(),
    }),
  }),
};
