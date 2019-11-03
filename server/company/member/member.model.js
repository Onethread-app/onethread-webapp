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
        'manager',
        'moderator',
        'employee',
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
    // TODO: currently working: boolean
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
