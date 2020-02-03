const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'application/zip',
        'application/pdf',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-excel',
        'text/plain',
        'text/csv',
        'image/apng',
        'image/png',
        'image/bmp',
        'image/gif',
        'image/jpeg',
        'image/jpg',
        'image/svg',
      ],
    },
    imageType: {
      type: String,
      enum: ['profilePic', 'coverPhoto'],
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    message: {
      type: Schema.ObjectId,
      ref: 'Message',
    },
    room: {
      type: Schema.ObjectId,
      ref: 'Room',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('File', fileSchema);
