const Joi = require('joi');

module.exports = {
  newCompany: {
    body: {
      type: Joi.string()
        .valid([
          'Manufacturer',
          'Trading Company',
          'Buying Office',
          'Agent',
          'Distributor/Wholesaler',
          'Government ministry/Bureau/Commission',
          'Association',
          'Business Service (Transportation, finance, travel, Ads, etc)',
          'Other'
        ])
        .required()
        .error(errors => {
          return {
            message: 'Invalid type'
          };
        })
    }
  },
  getCompany: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(errors => {
          return {
            message: 'Invalid ID'
          };
        })
    }
  },
  updateCompany: {
    body: {
      type: Joi.string()
        .valid([
          'Manufacturer',
          'Trading Company',
          'Buying Office',
          'Agent',
          'Distributor/Wholesaler',
          'Government ministry/Bureau/Commission',
          'Association',
          'Business Service (Transportation, finance, travel, Ads, etc)',
          'Other'
        ])
        .required()
        .error(errors => {
          return {
            message: 'Invalid type'
          };
        })
    },
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(errors => {
          return {
            message: 'Invalid ID'
          };
        })
    }
  },
  deleteCompany: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(errors => {
          return {
            message: 'Invalid ID'
          };
        })
    }
  }
};
