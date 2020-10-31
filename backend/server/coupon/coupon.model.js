const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Coupon';
const COLLECTION_NAME = 'coupons';

const schema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    discountPercent: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const CouponModel = mongoose.model(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);

module.exports = { CouponModel };
