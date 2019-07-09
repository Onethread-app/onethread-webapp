"use strict";
// Education Information
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const educationSchema = new Schema({
  highSchool: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    description: "can be only M or F",
    required: true
  },
  skillArea: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true
  },
  secondaryEmail: {
    type: String
  },
  birthday: {
    type: String
  },

  about: {
    type: String
  },
  location:{
    type: String
  },
  // education:{
  //    type: Schema.ObjectId,
  //    ref: "Education"
  //  },
  bloodGroup:{
    type: String,
    enum: ['A+', 'A-', 'O+','O-', 'AB+', 'AB-', 'B+', 'B-']
  },  
  bio: {
    type: String,
  }
  }); 
module.exports = mongoose.model('Education', educationSchema);