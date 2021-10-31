const mongoose = require('mongoose');

const { Schema } = mongoose;
const VideoConferenceSchema = new Schema(
  {
    link: {
      type: String,
      trim: true,
      required: true,
      maxlength: 3500,
    },
    room: {
      type: String,
      trim: true,
      required: true,
      maxlength: 3500,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const VideoConference = mongoose.model(
  'VideoConference',
  VideoConferenceSchema,
);

module.exports = {
  VideoConference,
};
