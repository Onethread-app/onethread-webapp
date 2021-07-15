const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// report issue schema
const reportSchema = new Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    issueType: {
      type: mongoose.Schema.Types.String,
    },
    title: {
      type: mongoose.Schema.Types.String,
    },
    issueDetails: {
      type: mongoose.Schema.Types.String,
    },
    imageUrl: {
      type: mongoose.Schema.Types.String,
    },
  },
  {
    timestamps: true,
  },
);

let Report = mongoose.model(
  'Report',
  reportSchema,
);

module.exports = {
  Report,
};
