"use strict";

const Joi = require('joi');

module.exports = {

    profile: {
        body: {
            name: Joi.string().required(),
            gender: Joi.string().required(),
            skillArea: Joi.string().required(),
            mobileNumber: Joi.string().required(),
            secondaryEmail: Joi.string(),
            birthday: Joi.string()
                         .regex(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/),
                         
            about: Joi.string(),
            bio: Joi.string()
        }
    }

};