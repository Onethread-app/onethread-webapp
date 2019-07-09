const Joi = require("joi");

module.exports = {
  // category validation
  newCategory: {
    body: {
      name: Joi.string().required()
    }
  },
  newSubCategory: {
    body: {
      name: Joi.string().required()
    },
    params: {
      cid: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }
  },
  newSubSubCategory: {
    body: {
      name: Joi.string().required()
    },
    params: {
      sid: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }
  },
  getCategory: {
    query: {
      type: Joi.string()
        .valid(["company", "user"])
        .required()
        .error(errors => {
          return {
            message: "Expects 'type' in query string"
          };
        })
    }
  },
  deleteCategory: {
    params: {
      cid: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }
  },
  deleteSubCategory: {
    params: {
      sid: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }
  },
  deleteSubSubCategory: {
    params: {
      ssid: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }
  }
};
