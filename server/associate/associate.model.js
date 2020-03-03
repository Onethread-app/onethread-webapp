const mongoose = require('mongoose');

const { Schema } = mongoose;

const AssociateSchema = new mongoose.Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      unique: false,
      required: true,
    },
    associateCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        unique: false,
      required: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
      },
    version : {
      type : Number,
      default : 0
    }
  },
  { timestamps: true },
);

AssociateSchema.index({ associateWith: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Associate', AssociateSchema);
