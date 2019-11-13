const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const { Schema } = mongoose;

const fileSchema = new mongoose.Schema({
  photoURL: {
    type: String,
    required: true,
  },
  s3_key: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Images', fileSchema);
