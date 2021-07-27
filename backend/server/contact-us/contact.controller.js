const logger = require('../../config/winston');

const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const { contactSaleMail } = require('../services/email.services');

const Contact = require('./contact.model');

const sendMail = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({
      name: name,
      email: email,
      subject: subject,
      message: message,
    });
    await contact.save();
    await contactSaleMail(contact.email, contact.subject, contact.message);
    return sendJSONresponse(res, 201, {
      message: 'Email Sent Successfully',
    });
  } catch (error) {
    console.log(error);
    logger.error(`${error}`);
    next(error);
  }
};

// const viewMail = async (req, res, next) => {
//   try {
//     const { limit = 50, skip = 0 } = req.query;
//     await Contact.find({})
//       .limit(+limit)
//       .skip(+skip)
//       .sort({ createdAt: -1 })
//       .exec()
//       .then((result) => {
//         return sendJSONresponse(res, 200, result);
//       });
//   } catch (error) {
//     logger.error(`${error}`);
//     next(error);
//   }
// };
module.exports = {
  sendMail,
  // viewMail,
};
