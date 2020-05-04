const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcement = new Schema(
  {
<<<<<<< HEAD
<<<<<<< HEAD
    memberId: {
=======
    memberId : {
>>>>>>> b7ca03f4... member added in company
=======
    memberId: {
>>>>>>> d06346b0... code style issue fixed
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    },
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
