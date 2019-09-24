'use strict';
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const Schema = mongoose.Schema;

// validation
function mainProductsLimit(val) {
  if (val.length > 0 && val.length <= 5) {
    return true;
  } else {
    return false;
  }
}

function otherProductsYouSellLimit(val) {
  return val.length <= 10;
}

function companyUrlLimit(val) {
  return val.length <= 3;
}

function checkUrl(val) {
  for (const e of val) {
    if (
      e.substring(0, 7) != 'http://' &&
      e.substring(0, 8) != 'https://'
    ) {
      return false;
    }
  }
  return true;
}

const validateUrl = [
  {
    validator: companyUrlLimit,
    msg: '{PATH} exceeds the limit of 3',
  },
  {
    validator: checkUrl,
    msg: '{PATH} should starts with [http://] or [https://]',
  },
];
// company schema
const company = new Schema({
  // required fields
  companyName: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  companyType: {
    type: String,
    enum: [
      'Manufacturer',
      'Trading Company',
      'Buying Office',
      'Agent',
      'Distributor/Wholesaler',
      'Government ministry/Bureau/Commission',
      'Association',
      'Business Service (Transportation, finance, travel, Ads, etc)',
      'Other',
    ],
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  companyMail: {
    type: String,
  },
  legalOwnerName: {
    type: String,
  },
  legalOwnerMail: {
    type: String,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  workplaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workplace',
    },
  ],
  // others
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSubCategory',
    },
  ],
  logo: {
    type: String,
  },
  location: {
    type: String,
  },
  companyUrl: {
    type: [String],
    validate: validateUrl,
  },
  yearCompanyRegistration: {
    type: Number,
    get: v => Number(v),
    set: v => Number(v),
    min: 1800,
    max: new Date().getFullYear(),
  },
  totalEmployees: {
    type: String,
    enum: [
      'Fewer than 5 People',
      '5 - 10 People',
      '11 - 50 People',
      '51 - 100 People',
      '101 - 200 People',
      '201 - 300 People',
      '301 - 500 People',
      '501 - 1000 People',
      'Above 1000 People',
    ],
  },
  officeSize: {
    type: String,
    enum: [
      'below 100 square meters',
      '101 - 500 square meters',
      '501 - 1000 square meters',
      '1001 -2000 square meters',
      'above 2000 square meters',
    ],
  },
  companyIntroduction: {
    type: String,
    maxlength: 256,
  },
});

// add timestamps
company.plugin(timestamp);

let Company = mongoose.model('Company', company);

module.exports = {
  Company,
};
