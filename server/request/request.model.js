const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// company schema
const projectRequestSchema = new Schema(
  {
      associates: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Associates',
      },
      size:{
        type: Number,
        enum: ["5", "25", "50"]
    },
      version: {
        type: Number,
        default: 0,
      },
      isAccepted: {
          type: Boolean,
          default: false
      },
      project:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Project',
      }
  },
  {
    timestamps: true,
  },
);

let ProjectRequest = mongoose.model('ProjectRequest', projectRequestSchema);

module.exports = {
  ProjectRequest,
};
