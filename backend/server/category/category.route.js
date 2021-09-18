const express = require('express');

const router = express.Router();
const categoryCtrl = require('./category.controller');

// authentication
router
  .route('/')
  .get(
    // authorization,
    // validate(paramValidation.getCategory),
    categoryCtrl.getCategory,
  )
  .post(
    // authorization,
    // // requireAuth,
    // // permit('admin'),
    // validate(paramValidation.newCategory),
    categoryCtrl.newCategory,
  );
router
  .route('/:cid')
  .get(
    // authorization,
    categoryCtrl.getSubCategory,
  )
  .post(
    // authorization,
    // // requireAuth,
    // // permit('admin'),
    // validate(paramValidation.newSubCategory),
    categoryCtrl.newSubCategory,
  )
  .delete(
    // requireAuth,
    // permit('admin'),
    // validate(paramValidation.deleteCategory),
    categoryCtrl.deleteCategory,
  );
router.route('/sub-category/:sid').post(
  // authorization,
  // // requireAuth,
  // // permit('admin'),
  // validate(paramValidation.newSubSubCategory),
  categoryCtrl.newSubSubCategory,
);
router.route('/products/:companyId').get(
  // authorization,
  categoryCtrl.getSubSubCategory,
);

module.exports = router;
