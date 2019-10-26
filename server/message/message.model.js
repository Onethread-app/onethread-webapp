
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
    {
      text: { 
        type: String,
        trim: true,
        required: true
      },
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
      },
      room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
      }
    },
    {
      timestamps: true
    }
  );

  
  
  let Message = mongoose.model('Message', MessageSchema);
  
  module.exports = {
    Message
  };