const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FeedbackSchema = new Schema(
  {
    improve: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    usefulFeature: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    wishFeature: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    rating: {
      type: Number,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Feedback', FeedbackSchema);
