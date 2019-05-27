"use strict";

const { Category, SubCategory, SubSubCategory } = require("./category.model");

const newCategory = async (req, res) => {
  // Check for JSON
  if (!req.is("application/json")) {
    return res.send("Expects 'application/json'");
  }
  // fetch the request data
  const category = new Category({
    name: req.body.name
  });

  category
    .save()
    .then(result => {
      res.status(201).json({
        message: "Handling POST requests to /api/v1/category/new-category",
        newCategory: {
          result
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
const newSubCategory = async (req, res) => {
  // Check for JSON
  if (!req.is("application/json")) {
    return res.send("Expects 'application/json'");
  }
  // category
  const category = await Category.findById(req.params.cid);

  // create sub-category
  const subcategory = new SubCategory(req.body);
  subcategory.cid = category;
  subcategory
    .save()
    .then(subcategory => {
      // save ref of sub-category in category
      category.subcategories.push(subcategory._id);
      category
        .save()
        .then(result => {
          res.status(201).json({
            message: `New sub-category created under Category: ${
              category.name
            }`,
            newSubCategory: {
              subcategory
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const newSubSubCategory = async (req, res) => {
  // Check for JSON
  if (!req.is("application/json")) {
    return res.send("Expects 'application/json'");
  }
  // sub-category
  const subcategory = await SubCategory.findById(req.params.sid);
  // create sub-sub-category
  const subsubcategory = new SubSubCategory(req.body);
  subsubcategory.sid = subcategory;
  subsubcategory
    .save()
    .then(subsubcategory => {
      // save ref of sub-sub-category in sub-category
      subcategory.subsubcategories.push(subsubcategory._id);
      subcategory
        .save()
        .then(result => {
          res.status(201).json({
            message: `New sub-sub-category created under Sub-Category: ${
              subcategory.name
            }`,
            newSubSubCategory: {
              subsubcategory
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const getCategory = (req, res, next) => {
  Category.find()
    .select("_id name")
    .exec()
    .then(categories => {
      const response = {
        categories: categories
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
const getSubCategory = (req, res, next) => {
  Category.findById(req.params.cid)
    .select("_id name subcategories")
    .populate("subcategories", "_id name")
    .exec()
    .then(result => {
      if (!result) {
        res.status(200).json({ message: `Invalid ID` });
      }
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
const getSubSubCategory = (req, res, next) => {
  SubCategory.findById(req.params.sid)
    .select("_id name subsubcategories")
    .populate("subsubcategories", "_id name")
    .exec()
    .then(result => {
      if (!result) {
        res.status(200).json({ message: `Invalid ID` });
      }
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

module.exports = {
  newCategory,
  newSubCategory,
  newSubSubCategory,
  getCategory,
  getSubCategory,
  getSubSubCategory
};
