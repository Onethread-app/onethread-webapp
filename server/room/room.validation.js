'use strict';

const Joi = require('joi');

module.exports = {
  createRoom: Joi.object().keys({
    body: Joi.object().keys({
      name: Joi.string()
        .max(32)
        .required(),
      company: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(errors => {
          return {
            message: 'Invalid ID',
          };
        }),
    }),
  }),
  addMember: {
    body: {
      room: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      member: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    },
  },
};
