const mongoose = require('mongoose');

const planSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
      enum: ['trial', 'enterprice', 'workspaces'],
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
      unique: false,
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

planSchema.index(
  { name: 1, validity: 1 },
  { unique: true },
);

module.exports = mongoose.model('Plan', planSchema);
