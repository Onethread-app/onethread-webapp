const Joi = require('joi');

function id() {
  return {
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .error(errors => {
        return {
          message: 'Invalid ID'
        };
      })
  };
}

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
  getBasicInfo: {
    params: id()
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
    params: id()
  },
  deleteBasicInfo: {
    params: id()
  }
};
