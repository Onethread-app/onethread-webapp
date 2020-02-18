const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// project schema
const project = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      maxlength: 32,
      required: true,
    },
    type: {
      type: String,
      enum: ['associates', 'Department', 'internal-project'],
      required: true,
    },
    label: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    outline: {
      type: String,
      maxlength: 2000,
    },
    files: [
      {
        type: Schema.ObjectId,
        ref: 'File',
      },
    ],
    members: [
      {
        type: Schema.ObjectId,
        ref: 'ProjectMember',
      },
    ],
    company: {
      type: Schema.ObjectId,
      ref: 'Company',
      required: true,
    },
    account: {
      type: Schema.ObjectId,
      ref: 'Account',
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

let Project = mongoose.model('Project', project);

module.exports = {
  Project,
};
