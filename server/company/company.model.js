'use strict';
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const Schema = mongoose.Schema;

// company schema
const company = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Manufacturer',
      'Trading Company',
      'Buying Office',
      'Agent',
      'Distributor/Wholesaler',
      'Government ministry/Bureau/Commission',
      'Association',
      'Business Service (Transportation, finance, travel, Ads, etc)',
      'Other'
    ]
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  }
});

// add timestamps
company.plugin(timestamp);

let Company = mongoose.model('Company', company);

module.exports = {
  Company
};
