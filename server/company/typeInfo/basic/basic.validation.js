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

function mainBody() {
  return {
    companyName: Joi.string().required(),
    locationOfReg: Joi.string().required(),
    companyOperationalAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      zipCode: Joi.string().required()
    }).required(),
    mainProducts: Joi.array()
      .min(1)
      .max(5)
      .items(Joi.string())
      .required(),
    otherProductsYouSell: Joi.array()
      .max(10)
      .items(Joi.string()),
    yearCompanyReg: Joi.number()
      .integer()
      .min(1800)
      .max(new Date().getFullYear()),
    totalEmp: Joi.string()
      .valid([
        'Fewer than 5 People',
        '5 - 10 People',
        '11 - 50 People',
        '51 - 100 People',
        '101 - 200 People',
        '201 - 300 People',
        '301 - 500 People',
        '501 - 1000 People',
        'Above 1000 People'
      ])
      .error(errors => {
        return {
          message: 'Please provide a valid input'
        };
      }),
    companyUrl: Joi.array()
      .max(3)
      .items(
        Joi.string()
          .regex(
            /^(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
          )
          .required()
      )
      .error(errors => {
        return {
          message: 'URL should starts with [http://] or [https://]'
        };
      }),
    legalOwner: Joi.string(),
    officeSize: Joi.string()
      .valid([
        'below 100 square meters',
        '101 - 500 square meters',
        '501 - 1000 square meters',
        '1001 -2000 square meters',
        'above 2000 square meters'
      ])
      .error(errors => {
        return {
          message: 'Please provide a valid input'
        };
      }),
    companyAdvantages: Joi.string().max(256)
  };
}
const bodySchema = Joi.object(mainBody()).unknown();
module.exports = {
  createBasicInfo: {
    body: mainBody()
  },
  getBasicInfo: {
    params: id()
  },
  updateCompany: {
    body: bodySchema,
    params: id()
  },
  deleteBasicInfo: {
    params: id()
  }
};
