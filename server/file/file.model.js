const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imageType: {
    type: String,
    enum: ['profilePic', 'coverPhoto'],
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
