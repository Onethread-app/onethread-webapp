const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    gateway: {
      type: String,
      required: true,
      enum: ['cash', 'stripe', 'portWallet'],
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'fail'],
      default: 'pending',
    },
    statusPg: {
      type: String,
      enum: ['success', 'pending', 'fail'],
      default: 'pending',
    },
    currency: {
      type: String,
      required: true,
      enum: ['bdt', 'usd', 'rs'],
    },
    discount: {
      type: Number,
      min : [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
    },
    subscription: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Subscription',
    },
    reference: {
        type: String,
        required: true,
    },
    amount: {
      type: Number,
      required: true,
      min : [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
    },
    company: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Company',
    },
    account: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
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

module.exports = mongoose.model('Payment', paymentSchema);
