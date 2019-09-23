const Joi = require('joi');
// Id
const id = Joi.object().keys({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(errors => {
      return {
        message: 'Invalid ID'
      };
    })
});
// opt
const accountInfo = {
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  password: Joi.string()
    .regex(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
    )
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required(),
  contactNo: Joi.string()
    .regex(/\+?(88)?0?1[356789][0-9]{8}/)
    .required()
};

// mainBody
const mainBody = Joi.object().keys({
  // stage 1 : company
  companyName: Joi.string().required(),
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
    .required(),
  logo: Joi.string().required(),
  location: Joi.string().required(),
  // stage 2 : owner
  stage2: Joi.boolean().required(),
  // if yes
  token: Joi.when('stage2', {
    is: true,
    then: accountInfo.token
  }),
  // if no
  email: Joi.when('stage2', {
    is: false,
    then: accountInfo.email
  }),
  firstName: Joi.when('stage2', {
    is: false,
    then: accountInfo.firstName
  }),
  lastName: Joi.when('stage2', {
    is: false,
    then: accountInfo.lastName
  }),
  password: Joi.when('stage2', {
    is: false,
    then: accountInfo.password
  }),
  confirmPassword: Joi.when('stage2', {
    is: false,
    then: accountInfo.confirmPassword
  }),
  contactNo: Joi.when('stage2', {
    is: false,
    then: accountInfo.contactNo
  }),
  // stage 3: product details
  products: Joi.array()
    .min(1)
    .max(5)
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .required(),
  // stage 4: Additional Information (Skip & Finish)
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
  companyMail: Joi.string()
    .email()
    .lowercase(),
  companyOperationalAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    zipCode: Joi.string().required()
  }),
  legalOwnerName: Joi.string(),
  legalOwnerMail: Joi.string()
    .email()
    .lowercase(),
  // others
  yearCompanyReg: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear()),
  totalEmp: Joi.string().valid([
    'Fewer than 5 People',
    '5 - 10 People',
    '11 - 50 People',
    '51 - 100 People',
    '101 - 200 People',
    '201 - 300 People',
    '301 - 500 People',
    '501 - 1000 People',
    'Above 1000 People'
  ]),
  officeSize: Joi.string().valid([
    'below 100 square meters',
    '101 - 500 square meters',
    '501 - 1000 square meters',
    '1001 -2000 square meters',
    'above 2000 square meters'
  ]),
  companyIntroduction: Joi.string().max(256)
});

module.exports = {
  newCompany: Joi.object().keys({
    body: mainBody
  }),
  getCompany: Joi.object().keys({
    params: id
  }),
  updateCompany: Joi.object().keys({
    body: mainBody,
    params: id
  }),
  deleteCompany: Joi.object().keys({
    params: id
  })
};
