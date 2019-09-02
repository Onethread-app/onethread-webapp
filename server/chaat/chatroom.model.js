const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatRoom = new Schema(
    {
      token: { //token
        type: String,
        trim: true,
        required: true
      },
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
      }
      
    },
    {
      timestamps: true
    }
  );

  let ChatRoom = mongoose.model('ChatRoom', chatRoom);

  module.exports = {
    ChatRoom
    
  };