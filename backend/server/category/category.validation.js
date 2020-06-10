const Joi = require('@hapi/joi');

module.exports = {
    // category validation
    newCategory: {
        body: {
            name: Joi.string()
                .required()
                .error((errors) => {
                    return {
                        message: "Expects 'name & type' in body",
                    };
                }),
            type: Joi.string()
                .valid([
                    'company',
                    'business-category',
                    'business',
                    'emp',
                    'job-seeker',
                ])
                .required()
                .error((errors) => {
                    return {
                        message: "Expects 'name & type' in body",
                    };
                }),
        },
    },
    newSubCategory: {
        body: {
            name: Joi.string().required(),
            company: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        },
        params: {
            cid: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        },
    },
    newSubSubCategory: {
        body: {
            name: Joi.string().required(),
        },
        params: {
            sid: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        },
    },
    getCategory: {
        query: {
            type: Joi.string()
                .valid([
                    'company',
                    'business-category',
                    'business',
                    'emp',
                    'job-seeker',
                ])
                .required()
                .error((errors) => {
                    return {
                        message: "Expects 'type' in query string",
                    };
                }),
        },
    },
    deleteCategory: {
        params: {
            cid: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required()
                .error((errors) => {
                    return {
                        message: 'Invalid ID',
                    };
                }),
        },
    },
};
