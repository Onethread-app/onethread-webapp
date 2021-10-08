const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const member = new Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      unique: false,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      unique: false,
      required: true,
    },
    role: {
      type: String,
      enum: [
        'superAdmin',
        'admin',
        'employee', //employee is member
      ],
      default: 'employee',
      required: true,
    },
    designations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designation',
      },
    ],
    removed: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

member.index({ account: 1, company: 1 }, { unique: true });

let Member = mongoose.model('Member', member);

module.exports = {
  Member,
};
