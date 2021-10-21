const Education = require('./education.model');
const Account = require('../account/account.model');
const { sendJSONresponse } = require('../helpers/jsonResponse.js');
const logger = require('../../config/winston');
const addEducation = async (req, res, next) => {
  const account = await Account.findById(req.user._id);
  const addEducation = new Education({
    degree: req.body.degree,
    institutionName: req.body.institutionName,
    startYear: req.body.startYear,
    endingYear: req.body.endingYear,
    eduDescription: req.body.eduDescription,
    currentlyStudy: req.body.currentlyStudy,
    account: req.user._id,
  });
  await addEducation
    .save()
    .then(async (data) => {
      account.education.push(data._id);
      await account.save();
      logger.info('new education for user created');
      return sendJSONresponse(res, 201, { data });
    })
    .catch((err) => {
      logger.error(`Error: ${err}`);
      return next(err);
    });
};

const updateEducation = async (req, res, next) => {
  try {
    if (!req.is('application/json')) {
      return sendErrorResponse(res, 406, 'ContentTypeError', {
        message: "Expects 'application/json'",
      });
    }
    const updateEdu = await Education.findByIdAndUpdate(
      {
        _id: req.query.educationId,
      },
      req.body,
      { new: true },
    );
    return sendJSONresponse(res, 200, { data: updateEdu });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEducation,
  updateEducation,
};
