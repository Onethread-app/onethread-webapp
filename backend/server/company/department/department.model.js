const mongoose = require('mongoose');
const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      require: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      require: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('Department', departmentSchema);
