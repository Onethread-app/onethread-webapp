const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jobExperienceSchema = new Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  positionName: {
    type: String,
    required: true,
    trim: true,
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
    trim: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
});
module.exports = mongoose.model('Jobexperience', jobExperienceSchema);
