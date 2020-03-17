const mongoose = require('mongoose');
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

const certificate = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    description:{
      type: String,
      trim: true
    },
    company:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }
  }
);

const parentCom = new Schema({
  name:{
    type: String,
    trim: true
  },
  company:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
})
// company schema
const company = new Schema(
  {
    logo: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      unique: true,
      trim: true,
      maxlength: 32,
      required: true,
    },
    type: {
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
    optionalRole: {
      type: [{
        type: String,
        enum: [
          'editProfile',
          'cRUDAnnouncement',
          'archiveProject',
          'addRemoveModerator',
          'messageAssociate',
          'addAcceptRejectAssociate',
          'acceptRejectProjectFromAssociate',
        ]
      }],
      default: ['editProfile']
    },
    
    address: {
      type: String,
      maxlength: 120,
      required: true,
    },
    about: {
      type: String,
      maxlength: 2000,
    },
    email: {
      type: String,
    },
    legalOwnerName: {
      type: String,
    },
    legalOwnerMail: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSubCategory',
      },
    ],
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
      },
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
      },
    ],
    location: {
      type: String,
    },
    websites: {
      type: [String],
      validate: validateUrl,
    },
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
      },
    ],
    registrationYear: {
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
    parentcom :[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parentcom'
    }],
    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

let Company = mongoose.model('Company', company);
let Certificate = mongoose.model('Certificate', certificate);
let Parentcom = mongoose.model('Parentcom', parentCom);

module.exports = {
  Company,
  Certificate,
  Parentcom,
};
