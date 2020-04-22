const Joi = require('joi');

module.exports = {
  createRoom: Joi.object().keys({
    body: Joi.object().keys({
      name: Joi.string().max(32).required(),
      company: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(() => {
          return {
            message: 'Invalid Company ID',
          };
        }),
      project: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(() => {
          return {
            message: 'Invalid Project ID',
          };
        }),
    }),
  }),
  addMembers: Joi.object().keys({
    body: Joi.object().keys({
      room: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      company: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      project: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      members: Joi.array()
        .min(1)
        .max(10)
        .items(
          Joi.object().keys({
            account: Joi.string()
              .regex(/^[0-9a-fA-F]{24}$/)
              .required(),
            team: Joi.string()
              .regex(/^[0-9a-fA-F]{24}$/)
              .required(),
          }),
        )
        .required(),
    }),
  }),
  archiveRoom: Joi.object().keys({
    params: Joi.object().keys({
      roomId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(() => {
          return {
            message: 'Invalid Room ID',
          };
        }),
    }),
    body: Joi.object().keys({
      archive: Joi.boolean().required(),
    }),
  }),
  getRoom: Joi.object().keys({
    params: Joi.object().keys({
      roomId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(() => {
          return {
            message: 'Invalid Room ID',
          };
        }),
    }),
  }),
  updateLastSeen: Joi.object().keys({
    params: Joi.object().keys({
      roomId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(() => {
          return {
            message: 'Invalid Room ID',
          };
        }),
    }),
  }),
};
