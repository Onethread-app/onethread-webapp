const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcement = new Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
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

let Announcement = mongoose.model('Announcement', announcement);

module.exports = {
  Announcement,
};
