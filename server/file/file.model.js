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
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/x-zip-compressed',
        'application/pdf',
        'application/msword',
        'application/json',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/plain',
        'text/csv',
        'image/webp',
        'image/apng',
        'image/png',
        'image/bmp',
        'image/gif',
        'image/jpeg',
        'image/jpg',
        'image/svg',
        'image/svg+xml',
        'image/bmp',
        'image/vnd.microsoft.icon',
      ],
    },
    imageType: {
      type: String,
      enum: ['profilePic', 'coverPhoto', 'companyLogo'],
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
