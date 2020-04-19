const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// company schema
const projectSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true,
    },
    type: {
      type: String,
      enum: ['sd', 'md', 'associates'], // sd = single department, md = multiple departments
      required: true,
    },
    description: {
      type: String,
      maxlength: 2500,
    },
    outline: {
      type: String,
      maxlength: 5000,
    },
    color: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
      default: 0,
    },
    concernedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    optionalRole: {
      type: [
        {
          type: String,
          enum: [
            'updateArchiveProject',
            'updateProjectPreface',
            'addFileProject',
            'addRemoveMemberRoom',
            'createUpdateRoom',
            'archiveRoom',
            'createUpdateBoard',
            'createUpdateColumn',
            'assignDeleteMemberBoard',
          ],
        },
      ],
    },

    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
      },
    ],
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    projectRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectRequest',
      },
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
      },
    ],
    company: {
      // which company create the project // project owner
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    version: {
      type: Number,
      default: 0,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    associate: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Associate',
      },
    ],
  },
  {
    timestamps: true,
  },
);

let Project = mongoose.model('Project', projectSchema);

module.exports = {
  Project,
};
