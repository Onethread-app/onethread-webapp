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
};
