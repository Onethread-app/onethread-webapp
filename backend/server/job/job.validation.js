const Joi = require('@hapi/joi');

const schema = {
    companyName: Joi.string().trim().lowercase().min(2).max(32),
    positionName: Joi.string().trim().lowercase().min(2).max(32),
    startYear: Joi.date(),
    endingYear: Joi.date().greater(Joi.ref('startYear')),
    currentlyWork: Joi.boolean(),
    jobDescription: Joi.string().trim().min(1).max(1000),
    jobexperienceid: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
       
}

module.exports = {
  createJob: Joi.object().keys({
    body: Joi.object().keys({
        companyName: schema.companyName.required(),
        positionName: schema.positionName.required(),
        startYear: schema.startYear.required(),
        endingYear: schema.endingYear.required(),
        currentlyWork: schema.currentlyWork.required(),
        jobDescription:schema.jobDescription
    }),
  }),
  updateJob: Joi.object().keys({
      query: Joi.object().keys({
          jobexperienceid: schema.jobexperienceid
      }),
      body: Joi.object().keys({
        companyName: schema.companyName,
        positionName: schema.positionName,
        startYear: schema.startYear,
        endingYear: schema.endingYear,
        currentlyWork: schema.currentlyWork,
        jobDescription:schema.jobDescription
    }),
  })
};
