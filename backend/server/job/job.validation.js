const Joi = require('@hapi/joi');

const schema = {
  companyName: Joi.string().max(32).trim(),
  positionName: Joi.string().max(32).trim(),
  startYear: Joi.date(),
  endingYear: Joi.date().min(Joi.ref('startYear')),
  currentlyWork: Joi.boolean(),
  jobDescription: Joi.string().max(500).trim().allow(''),
};

module.exports = {
  createJobExperience: Joi.object().keys({
    body: Joi.object().keys({
      companyName: schema.companyName.required(),
      positionName: schema.positionName.required(),
      startYear: schema.startYear,
      endingYear: schema.endingYear,
      currentlyWork: schema.currentlyWork,
      jobDescription: schema.jobDescription,
    }),
  }),
  updateJobExperience: Joi.object().keys({
    body: Joi.object().keys({
      companyName: schema.companyName,
      positionName: schema.positionName,
      startYear: schema.startYear,
      endingYear: schema.endingYear,
      currentlyWork: schema.currentlyWork,
      jobDescription: schema.jobDescription,
    }),
  }),
};
