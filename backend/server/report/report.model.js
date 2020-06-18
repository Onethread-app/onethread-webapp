const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
  text: {
    //reason repor deatils
    type: String,
    trim: true,
    required: true,
  },
  reportContent: {
    type: [
      {
        type: String,
        enum: ['post', 'comment', 'user', 'others'],
      },
    ],
  },
  reportType: {
    type: [
      {
        type: String,
        enum: [
          'harmful',
          'violence',
          'threat',
          'annoying',
          'gross',
          'false',
          'abusive',
          'pornography',
          'spam',
          'compromise',
          'offensive',
          'disrespectful',
          'privateExposed',
          'others',
        ],
      },
    ],
    default: ['others'],
  },
  reviewStatus: {
    type: [
      {
        type: String,
        enum: ['block', 'noofense', 'others', 'notresoolved'],
      },
    ],
    default: ['notresoolved'],
  },
  reviewText: {
    type: String,
    trim: true,
  },
  post: {
    type: Schema.ObjectId,
    ref: 'Post',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  comment: {
    type: Schema.ObjectId,
    ref: 'Comment',
  },
  removed: {
    type: Boolean,
    default: false,
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account',
  },
});

module.exports = mongoose.model('Report', ReportSchema);
