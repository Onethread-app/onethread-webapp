const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamMember = new Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      unique: false,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      unique: false,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'projectModerator', 'member'], 
      default: 'member',
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

teamMember.index({ account: 1, project: 1 }, { unique: true });

let Team = mongoose.model('Team', teamMember);

module.exports = {
  Team,
};
