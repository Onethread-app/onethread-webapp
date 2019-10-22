const mongoose = require('mongoose');
const { Schema } = mongoose;
const skillAreaSchema = mongoose.Schema({
  skill: {
    type: String,
  },
  accountId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
});

module.exports = mongoose.model('SkillArea', skillAreaSchema);
