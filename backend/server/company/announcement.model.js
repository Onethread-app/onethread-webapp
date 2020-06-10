const mongoose = require('mongoose');

const {Schema} = mongoose;

const announcement = new Schema(
<<<<<<< HEAD
    {
        memberId: {
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
=======
  {
    memberId: {
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
>>>>>>> 08ac3400... member added in company
    },
    {
        timestamps: true,
    },
);

const Announcement = mongoose.model('Announcement', announcement);

module.exports = {
    Announcement,
};
