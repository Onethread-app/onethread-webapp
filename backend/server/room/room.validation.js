const Joi = require('@hapi/joi');

const id = Joi.object().keys({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error((errors) => {
      return {
        message: 'Invalid ID',
      };
    }),
});

module.exports = {
  createRoom: Joi.object().keys({
    body: Joi.object().keys({
      name: Joi.string().max(32).required(),
      company: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error((errors) => {
          return {
            message: 'Invalid Company ID',
          };
        }),
      project: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error((errors) => {
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
      members: Joi.array()
        .min(1)
        .max(10)
        .items(
          Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        )
        .required(),
    }),
  }),
  archiveRoom: Joi.object().keys({
    params: Joi.object().keys({
      roomId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error((errors) => {
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
        .error((errors) => {
          return {
            message: 'Invalid Room ID',
          };
        }),
    }),
  }),
};
