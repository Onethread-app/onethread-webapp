'use strict';

const mongoose = require('mongoose');
mongoose.plugin(schema => {
  schema.options.usePushEach = true;
});
//let timestamp = require("mongoose-timestamp");

// defining all the fields of main category
let categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory'
    }
  ],
  type: {
    type: String,
    required: true,
    enum: ['company', 'business-category', 'business', 'emp', 'job-seeker']
  }
});

// defining all the fields of sub-category
let subCategorySchema = mongoose.Schema({
  cid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  subsubcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSubCategory'
    }
  ]
});

// defining all the fields of sub-sub-category
let subSubCategorySchema = mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    unique: false,
    required: true,
  },
  cid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  sid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

// categorySchema.plugin(timestamp);
// subCategorySchema.plugin(timestamp);
// subSubCategorySchema.plugin(timestamp);

let Category = (module.exports = mongoose.model('Category', categorySchema));
let SubCategory = (module.exports = mongoose.model(
  'SubCategory',
  subCategorySchema
));
let SubSubCategory = (module.exports = mongoose.model(
  'SubSubCategory',
  subSubCategorySchema
));

module.exports = {
  Category,
  SubCategory,
  SubSubCategory
};
