const mongoose = require('mongoose');

const DOCUMENT_NAME = 'CompanyCoupon';
const COLLECTION_NAME = 'companycoupons';

const schema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    isUsed: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

schema.index({ company: 1, coupon: 1 }, { unique: true });

const CompanyCouponModel = mongoose.model(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);

module.exports = { CompanyCouponModel };
