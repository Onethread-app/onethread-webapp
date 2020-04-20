const Review = require('./review.model');

const load = (req, res, next, id) => {
  Review.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        req.review = result;
        return next();
      }
      return res
        .status(400)
        .json({ message: 'No valid entry found for provided ID' });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const get = (req, res) => {
  return res.json(req.save);
};

const create = (req, res, next) => {
  const review = new Review({
    accountRef: req.body.accountRef,
    text: req.body.reqtext,
    rating: req.body.rating,
    account: req.user,
  });

  review
    .save()
    .then((result) => res.send(result))
    .catch((e) => next(e));
};

const list = (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  Review.find({ removed: false })
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => res.json(result))
    .catch((e) => next(e));
};

const remove = (req, res, next) => {
  const review = req.review;
  review.removed = true;

  review
    .remove()
    .then((result) => res.json(result))
    .catch((e) => next(e));
};

module.exports = { load, create, get, remove, list };
