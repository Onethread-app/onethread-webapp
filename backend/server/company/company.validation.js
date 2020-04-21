const Joi = require('@hapi/joi');

// id
<<<<<<< HEAD
const idSchema = {
=======
const idSchema = Joi.object().keys({
>>>>>>> b7ca03f4... member added in company
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error((errors) => {
      return {
        message: 'Invalid ID',
      };
    }),
};

// company-id
const companyId = Joi.object().keys({
  companyId: idSchema.id.required()
});

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
  about: Joi.string().allow('').max(2000),
  email: Joi.string().email().lowercase().allow(''),
  legalOwnerName: Joi.string().allow(''),
  legalOwnerMail: Joi.string().email().lowercase().allow(''),
  products: Joi.array()
    .min(1)
    .max(5)
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  optionalRole: Joi.array().min(0).max(7)
  .items(Joi.string().valid([
    'editProfile',
    'cRUDAnnouncement',
    'archiveProject',
    'addRemoveModerator',
    'messageAssociate',
    'addAcceptRejectAssociate',
    'acceptRejectProjectFromAssociate',
  ])),
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
    .error((errors) => {
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
  announcement: Joi.string().max(500),
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
      name: schema.name,
      type: schema.type,
      address: schema.address,
      email: schema.email,
      legalOwnerName: schema.legalOwnerName,
      legalOwnerMail: schema.legalOwnerMail,
    }),
    params: companyId,
  }),
  updateAbout: Joi.object().keys({
    body: Joi.object().keys({
      about: schema.about,
    }),
    params: companyId,
  }),
  changeRole: Joi.object().keys({
    body: Joi.object().keys({
      optionalRole: schema.optionalRole.required(),
    }),
    params: companyId,
  }),
  changeName: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
    }),
    params: companyId,
  }),
  deleteCompany: Joi.object().keys({
    params: companyId,
  }),
  search: Joi.object().keys({
    query: sname,
  }),
  dashboard: Joi.object().keys({
    params: companyId,
  }),
  createNotice: Joi.object().keys({
    params: companyId,
    body: Joi.object().keys({
      text: schema.announcement,
      memberId: idSchema.id.required()
    }),
  }),
  allNoticesForCompany: Joi.object().keys({
    params: companyId,
  }),
};
