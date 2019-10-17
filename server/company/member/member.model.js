const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const member = new Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    role: {
      type: String,
      enum: [
        'Super Admin',
        'Admin',
        'Manager',
        'Moderator',
        'employee',
      ],
      default: 'employee',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

let Member = mongoose.model('Member', member);

module.exports = {
  Member,
};
