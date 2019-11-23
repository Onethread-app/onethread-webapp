const mongoose = require('mongoose');

const designationSchema = mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    division: {
      type: String,
      enum: [
        'director',
        'cxo',
        'seniorManager',
        'middleManager',
        'operationalEmployee',
      ],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    position: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    current: {
      type: Boolean,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

let Designation = mongoose.model('Designation', designationSchema);

module.exports = {
  Designation,
};
