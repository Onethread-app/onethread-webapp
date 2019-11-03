const mongoose = require('mongoose');
const { Schema } = mongoose;
const skillAreaSchema = mongoose.Schema({
<<<<<<< HEAD
  name: {
=======
  skill: {
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
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
