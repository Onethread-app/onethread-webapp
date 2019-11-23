const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new mongoose.Schema({
  fileLink: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  room: {
    type: Schema.ObjectId,
    ref: 'Room',
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('File', fileSchema);
