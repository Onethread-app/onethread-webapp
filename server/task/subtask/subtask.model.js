const mongoose = require('mongoose');

const { schema } = mongoose;

const SubTaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('SubTask', SubTaskSchema);