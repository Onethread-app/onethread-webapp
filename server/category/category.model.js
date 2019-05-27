"use strict";

const mongoose = require("mongoose");
mongoose.plugin(schema => {
  schema.options.usePushEach = true;
});
var timestamp = require("mongoose-timestamp");

// defining all the fields of main category
var categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory"
    }
  ],
  type: {
    type: String,
    required: true,
    enum: ["company", "user"],
    default: "company"
  }
});

// defining all the fields of sub-category
var subCategorySchema = mongoose.Schema({
  cid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  subsubcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubCategory"
    }
  ]
});

// defining all the fields of sub-sub-category
var subSubCategorySchema = mongoose.Schema({
  sid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
});

// categorySchema.plugin(timestamp);
// subCategorySchema.plugin(timestamp);
// subSubCategorySchema.plugin(timestamp);

var Category = (module.exports = mongoose.model("Category", categorySchema));
var SubCategory = (module.exports = mongoose.model(
  "SubCategory",
  subCategorySchema
));
var SubSubCategory = (module.exports = mongoose.model(
  "SubSubCategory",
  subSubCategorySchema
));

module.exports = {
  Category,
  SubCategory,
  SubSubCategory
};
