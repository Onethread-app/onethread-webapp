const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// company schema
const projectSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
    },
    type: {
      type: String,
      enum: ['sd', 'md', 'associates'],
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

    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
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
        ref: 'Account',
      },
    ],
    associates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Associates',
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

let Project = mongoose.model('Project', projectSchema);

module.exports = {
  Project,
};
