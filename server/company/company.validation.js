const Joi = require('joi');

// id
const id = Joi.object().keys({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(errors => {
      return {
        message: 'Invalid ID',
      };
    }),
});

// company-name
const cname = Joi.object().keys({
  cname: Joi.string().required(),
});
const sname = Joi.object().keys({
  name: Joi.string().min(1),
});


// joi schema
const schema = {
  name: Joi.string().max(32),
  type: Joi.string().valid([
    'Manufacturer',
    'Trading Company',
    'Buying Office',
    'Agent',
    'Distributor/Wholesaler',
    'Government ministry/Bureau/Commission',
    'Association',
    'Business Service (Transportation, finance, travel, Ads, etc)',
    'Other',
  ]),
  address: Joi.string().max(120),
  about: Joi.string()
    .allow('')
    .max(2000),
  email: Joi.string()
    .email()
    .lowercase(),
  legalOwnerName: Joi.string(),
  legalOwnerMail: Joi.string()
    .email()
    .lowercase(),
  products: Joi.array()
    .min(1)
    .max(5)
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  optionalRole: Joi.array()
    .min(1)
    .max(5)
    .items(Joi.string()),
  location: Joi.string(),
  websites: Joi.array()
    .max(3)
    .items(
      Joi.string()
        .regex(
          /^(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
        )
        .required(),
    )
    .error(errors => {
      return {
        message: 'URL should starts with [http://] or [https://]',
      };
    }),
  registrationYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear()),
  totalEmployees: Joi.string().valid([
    'Fewer than 5 People',
    '5 - 10 People',
    '11 - 50 People',
    '51 - 100 People',
    '101 - 200 People',
    '201 - 300 People',
    '301 - 500 People',
    '501 - 1000 People',
    'Above 1000 People',
  ]),
  officeSize: Joi.string().valid([
    'below 100 square meters',
    '101 - 500 square meters',
    '501 - 1000 square meters',
    '1001 -2000 square meters',
    'above 2000 square meters',
  ]),
};

module.exports = {
  newCompany: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      type: schema.type.required(),
      address: schema.address.required(),
      email: schema.email,
      legalOwnerName: schema.legalOwnerName,
      legalOwnerMail: schema.legalOwnerMail,
    }),
  }),
  getCompany: Joi.object().keys({
    params: cname,
  }),
  updateBasicInfo: Joi.object().keys({
    body: Joi.object().keys({
      address: schema.address.required(),
      email: schema.email,
      legalOwnerName: schema.legalOwnerName,
      legalOwnerMail: schema.legalOwnerMail,
    }),
    params: cname,
  }),
  updateAbout: Joi.object().keys({
    body: Joi.object().keys({
      about: schema.about,
    }),
    params: cname,
  }),
  changeRole: Joi.object().keys({
    body: Joi.object().keys({
      optionalRole: schema.optionalRole.required(),
    }),
    params: cname,
  }),
  changeName: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
    }),
    params: cname,
  }),
  deleteCompany: Joi.object().keys({
    params: cname,
  }),
  search: Joi.object().keys({
    query: sname,
  }),
};
