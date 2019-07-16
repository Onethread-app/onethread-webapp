'use strict';
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const Schema = mongoose.Schema;
//
let validateUrl = [
  { validator: companyUrlLimit, msg: '{PATH} exceeds the limit of 3' },
  {
    validator: checkUrl,
    msg: '{PATH} should starts with [http://] or [https://]'
  }
];
// company schema
const basic = new Schema({
  companyName: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  locationOfReg: {
    type: String,
    required: true
  },
  companyOperationalAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  mainProducts: {
    type: [String],
    validate: [
      mainProductsLimit,
      '{PATH} is required and should not greater than 5'
    ],
    required: true
  },
  otherProductsYouSell: {
    type: [String],
    validate: [otherProductsYouSellLimit, '{PATH} exceeds the limit of 10']
  },
  yearCompanyReg: {
    type: Number,
    get: v => Number(v),
    set: v => Number(v),
    min: 1800,
    max: new Date().getFullYear()
  },
  totalEmp: {
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
      'Above 1000 People'
    ]
  },
  companyUrl: {
    type: [String],
    validate: validateUrl
  },
  legalOwner: {
    type: String
  },
  officeSize: {
    type: String,
    enum: [
      'below 100 square meters',
      '101 - 500 square meters',
      '501 - 1000 square meters',
      '1001 -2000 square meters',
      'above 2000 square meters'
    ]
  },
  companyAdvantages: {
    type: String,
    maxlength: 256
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    unique: true,
    required: true
  }
});

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
    if (e.substring(0, 7) != 'http://' && e.substring(0, 8) != 'https://') {
      return false;
    }
  }
  return true;
}

// add timestamps
basic.plugin(timestamp);

let Basic = mongoose.model('CompaniesBasic-Info', basic);

module.exports = {
  Basic
};
