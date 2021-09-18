const mongoose = require('mongoose');

const { Schema } = mongoose;
const skillAreaSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  account: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
});

module.exports = mongoose.model('SkillArea', skillAreaSchema);
