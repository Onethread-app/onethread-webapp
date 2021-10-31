const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
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
const Subscription = mongoose.model('Subscription', subscriptionSchema);
// subscriptionSchema.index({ company: 1, plan: 1 }, { unique: true });
module.exports = {
  Subscription,
};
