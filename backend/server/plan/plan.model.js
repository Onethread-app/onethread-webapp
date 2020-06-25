const mongoose = require('mongoose');

const planSchema = mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['trial', 'small', 'medium', 'enterprise'],
    },
    maxTier: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      max: 200,
      trim: true,
      lowercase: true,
    },
    pricing: {
      type: Number,
      required: true,
    },
    validity: {
      type: Number,
      required: true,
      default: 30,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Plan', planSchema);
