const {Category, SubCategory, SubSubCategory} = require('./category.model');
// Create
const newCategory = async (req, res) => {
    // Check for JSON
    if (!req.is('application/json')) {
        return sendErrorResponse(res, 406, 'ContentTypeError', {
            message: "Expects 'application/json'",
        });
    }
    // fetch the request data
    const category = new Category({
        name: req.body.name,
        type: req.body.type,
    });

    category
        .save()
        .then((result) => {
            res.status(201).json({
                message: 'New category created',
                newCategory: result,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};

const newSubCategory = async (req, res) => {
    // Check for JSON
    if (!req.is('application/json')) {
        return sendErrorResponse(res, 406, 'ContentTypeError', {
            message: "Expects 'application/json'",
        });
    }
    // category
    const category = await Category.findById(req.params.cid);

    // create sub-category
    const subcategory = new SubCategory(req.body);
    subcategory.cid = category;
    subcategory
        .save()
        .then((subcategory) => {
            // save ref of sub-category in category
            category.subcategories.push(subcategory._id);
            category
                .save()
                .then((result) => {
                    res.status(201).json({
                        message: `New sub-category created under Category: ${category.name}`,
                        newSubCategory: subcategory,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: '====Level-two ERROR====',
                        error: err,
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
const newSubSubCategory = async (req, res) => {
    // Check for JSON
    if (!req.is('application/json')) {
        return sendErrorResponse(res, 406, 'ContentTypeError', {
            message: "Expects 'application/json'",
        });
    }
    // sub-category
    const subcategory = await SubCategory.findById(req.params.sid);
    // create sub-sub-category
    const subsubcategory = new SubSubCategory(req.body);
    subsubcategory.cid = subcategory.cid;
    subsubcategory.sid = subcategory;
    subsubcategory
        .save()
        .then((subsubcategory) => {
            // save ref of sub-sub-category in sub-category
            subcategory.subsubcategories.push(subsubcategory._id);
            subcategory
                .save()
                .then((result) => {
                    res.status(201).json({
                        message: `New sub-sub-category created under Sub-Category: ${subcategory.name}`,
                        newSubSubCategory: subsubcategory,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        error: err,
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
// Read
const getCategory = (req, res, next) => {
    // get category
    Category.find({type: req.query.type})
        .sort('name')
        .select('_id name')
        .exec()
        .then((categories) => {
            const response = {
                type: req.query.type,
                categories: categories.map((doc) => {
                    const result = {
                        _id: doc._id,
                        name: doc.name,
                    };
                    // check for business-category
                    if (doc.name == 'Category of one’s business') {
                        result.request = {
                            type: 'GET',
                            url: '/api/v1/category?type=business-category',
                        };
                    }
                    return result;
                }),
            };
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
const getSubCategory = (req, res, next) => {
    Category.findById(req.params.cid)
        .select('_id name subcategories')
        .populate('subcategories', '_id name')
        .exec()
        .then((result) => {
            if (!result) {
                res.status(200).json({message: 'Invalid ID'});
            }
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
const getSubSubCategory = (req, res, next) => {
    SubSubCategory.find({
        company: req.params.companyId,
    })
        .select('_id name subsubcategories')
        .populate('subsubcategories', '_id name')
        .exec()
        .then((result) => {
            if (!result) {
                res.status(200).json({message: 'Invalid ID'});
            }
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};
// Delete
const deleteCategory = async (req, res, next) => {
    // category
    try {
        const category = await Category.findOneAndRemove({
            _id: req.params.cid,
        });

        if (!category) {
            res.status(500).json({
                message: 'No category found with this ID',
            });
        } else {
            // sub-category
            try {
                const subcategory = await SubCategory.findOneAndRemove({
                    cid: req.params.cid,
                });

                if (subcategory) {
                    // sub-category
                    try {
                        const subsubcategory = await SubSubCategory.findOneAndRemove(
                            {
                                cid: req.params.cid,
                            },
                        );

                        if (subsubcategory) {
                            // sub-category
                            res.status(200).json({
                                message:
                                    'Category deleted with all subcategories and subsubcategories.',
                            });
                        }
                    } catch (err) {
                        res.status(500).json({
                            error: err,
                        });
                    }
                }
            } catch (err) {
                res.status(500).json({
                    error: err,
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

module.exports = {
    newCategory,
    newSubCategory,
    newSubSubCategory,
    getCategory,
    getSubCategory,
    getSubSubCategory,
    deleteCategory,
};
