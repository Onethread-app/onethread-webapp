// const Joi = require('joi');
// // Id
// const id = Joi.object().keys({
//   id: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .error(errors => {
//       return {
//         message: 'Invalid ID',
//       };
//     }),
// });
// // opt
// const accountInfo = {
//   token: Joi.string().required(),
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
//   email: Joi.string()
//     .email()
//     .lowercase()
//     .required(),
//   password: Joi.string()
//     .regex(
//       /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
//     )
//     .required(),
//   confirmPassword: Joi.string()
//     .valid(Joi.ref('password'))
//     .required(),
//   contactNo: Joi.string()
//     .regex(/\+?(88)?0?1[356789][0-9]{8}/)
//     .required(),
// };

// // mainBody
// const mainBody = Joi.object().keys({
//   // stage 1 : company
//   name: Joi.string().required(),
//   type: Joi.string()
//     .valid([
//       'Manufacturer',
//       'Trading Company',
//       'Buying Office',
//       'Agent',
//       'Distributor/Wholesaler',
//       'Government ministry/Bureau/Commission',
//       'Association',
//       'Business Service (Transportation, finance, travel, Ads, etc)',
//       'Other',
//     ])
//     .required(),
//   address: Joi.string().required(),
//   email: Joi.string()
//     .email()
//     .lowercase(),
//   legalOwnerName: Joi.string(),
//   legalOwnerMail: Joi.string()
//     .email()
//     .lowercase(),
//   products: Joi.array()
//     .min(1)
//     .max(5)
//     .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
//   // stage 4: Additional Information (Skip & Finish)
//   logo: Joi.string(),
//   location: Joi.string().required(),
//   websites: Joi.array()
//     .max(3)
//     .items(
//       Joi.string()
//         .regex(
//           /^(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
//         )
//         .required(),
//     )
//     .error(errors => {
//       return {
//         message: 'URL should starts with [http://] or [https://]',
//       };
//     }),
//   registrationYear: Joi.number()
//     .integer()
//     .min(1800)
//     .max(new Date().getFullYear()),
//   totalEmployees: Joi.string().valid([
//     'Fewer than 5 People',
//     '5 - 10 People',
//     '11 - 50 People',
//     '51 - 100 People',
//     '101 - 200 People',
//     '201 - 300 People',
//     '301 - 500 People',
//     '501 - 1000 People',
//     'Above 1000 People',
//   ]),
//   officeSize: Joi.string().valid([
//     'below 100 square meters',
//     '101 - 500 square meters',
//     '501 - 1000 square meters',
//     '1001 -2000 square meters',
//     'above 2000 square meters',
//   ]),
//   about: Joi.string().max(256),
// });

// module.exports = {
//   newCompany: Joi.object().keys({
//     body: mainBody,
//   }),
//   getCompany: Joi.object().keys({
//     params: id,
//   }),
//   updateCompany: Joi.object().keys({
//     body: mainBody,
//     params: id,
//   }),
//   deleteCompany: Joi.object().keys({
//     params: id,
//   }),
// };
