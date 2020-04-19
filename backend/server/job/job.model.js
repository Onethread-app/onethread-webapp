const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jobExperienceSchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  positionName: {
    type: String,
    required: true,
  },
  startYear: {
    type: Date,
  },
  endingYear: {
    type: Date,
  },
  currentlyWork: {
    type: Boolean,
  },
  jobDescription: {
    type: String,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
});
module.exports = mongoose.model('Jobexperience', jobExperienceSchema);
