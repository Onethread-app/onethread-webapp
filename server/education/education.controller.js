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
    currentlyStudy: req.body.currentlyStudy,
    account: req.user._id,
  });
  await addEducation
    .save()
    .then(async data => {
      account.education.push(data._id);
      await account.save();
      logger.info('new education for user created');
      return sendJSONresponse(res, 201, { data });
    })
    .catch(err => {
      logger.error(`Error: ${err}`);
      return next(err);
    });
};

module.exports = {
  addEducation,
};
