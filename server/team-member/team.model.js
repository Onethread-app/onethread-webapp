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
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      unique: false,
      required: true,
    },
    role:{
      type: String,
      enum: ['pm', 'sm', 'm'], // pm = project-moderator, sm = Special Member from Associate, m = Member
      default: 'm',
      required: true,
    },
    // role: {
    //   type: String,
    //   enum: [
    //     'superAdmin',
    //     'admin',
    //     'manager',
    //     'moderator',
    //     'employee',
    //   ],
    //   default: 'employee',
    //   required: true,
    // },
    // designations: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Designation',
    //   },
    // ],
    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

teamMember.index({ member: 1, project: 1 }, { unique: true });

let Team = mongoose.model('Team', teamMember);

module.exports = {
  Team,
};
