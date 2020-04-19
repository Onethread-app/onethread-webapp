const Joi = require('joi');

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

// joi schema
const schema = {
  account: idSchema.id,
  room: idSchema.id,
  text: Joi.string().max(3500),
  type: Joi.string()
    .valid(['text', 'file', 'attachment'])
    .default('text'),
  files: Joi.array(),
};

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      text: schema.text.allow(''),
      room: schema.room.required(),
      type: schema.type,
      files: schema.files,
    }),
  }),
  getRoomMessages: Joi.object().keys({
    params: Joi.object().keys({
      roomId: schema.room.required(),
    }),
  }),
  getRoomFiles: Joi.object().keys({
    params: Joi.object().keys({
      roomId: schema.room.required(),
    }),
  }),
  getRoomDiscussion: Joi.object().keys({
    params: Joi.object().keys({
      roomId: schema.room.required(),
    }),
  }),
  toggleDiscussion: Joi.object().keys({
    params: Joi.object().keys({
      messageId: idSchema.id.required(),
    }),
    body: Joi.object().keys({
      discussion: Joi.boolean().required(),
    }),
  }),
};
