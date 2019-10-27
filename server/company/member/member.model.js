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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division',
    },
    position: {
      type: String,
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
