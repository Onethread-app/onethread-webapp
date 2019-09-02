
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSingle = new Schema(
    {
      text: { //token
        type: String,
        trim: true,
        required: true
      },
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
      },
      reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
      }
    },
    {
      timestamps: true
    }
  );

  
  
  let ChatSingle = mongoose.model('ChatSingle', chatSingle);
  
  module.exports = {
    ChatSingle
  };