const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingTeam = new Schema(
  {
    email: {
      type: String,
      maxlength: 256,
      lowercase: true,
      trim: true,
      unique: false,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      unique: false,
      required: true,
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

pendingTeam.index({ project: 1, member: 1 }, { unique: true });

let PendingTeam = mongoose.model('PendingTeam', pendingTeam);

module.exports = {
  PendingTeam,
};
