const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamMember = new Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      unique: false,
      required: true,
    },
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
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

teamMember.index(
  { member: 1, account: 1, project: 1 },
  { unique: true },
);

let Team = mongoose.model('Team', teamMember);

module.exports = {
  Team,
};
