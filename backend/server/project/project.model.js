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
    description: {
      type: String,
      maxlength: 2500,
      trim: true,
    },
    outline: {
      type: String,
      maxlength: 5000,
      trim: true,
    },
    deadline: {
      type: Date,
    },
    color: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
      default: 0,
    },
    status: {
      type: String,
      enum: ['not-started', 'ongoing', 'completed'],
      default: 'not-started',
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
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        // required: true,
      },
    ],
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
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
      // required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
    },
    version: {
      type: Number,
      default: 0,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    hasDeleted: {
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
