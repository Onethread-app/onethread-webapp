const mongoose = require('mongoose');
const { Schema } = mongoose;

const label = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    color: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true },
);

label.index({ name: 1, company: 1 }, { unique: true });
module.exports = mongoose.model('Label', label);
