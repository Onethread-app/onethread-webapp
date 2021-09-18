const mongoose = require('mongoose');

const { Schema } = mongoose;
const accountSkillSchema = mongoose.Schema({
  skillArea: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillArea',
      unique: true,
    },
  ],
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    unique: true,
  },
});
// accountSkillSchema.index(
//   { skillArea: 1, accountId: 1 },
//   { unique: true },
// );
const AccountSkill = mongoose.model('AccountSkill', accountSkillSchema);

module.exports = {
  AccountSkill,
};
