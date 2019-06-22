const React = require('./react.model');

function load(req, res, next, id) {
    React.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.save = result;
        return next();
      }
      return res
        .status(400)
        .json({ message: 'No valid entry found for provided ID' });
    })
    .catch(err => {
      // console.log(err);
      next(err);
    });
}

function get(req, res) {
  return res.json(req.save);
}

function create(req, res, next) {
  const save = new React({
    postRef: req.body.postRef,
    account: req.user
  });

  save
    .save()
    .then(result => res.send(result))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  React.find({ removed: false })
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
     .then(result => res.json(result))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const react = req.react;
  react.removed = true;

  react
    .save()
    .then(result => res.json(result))
    .catch(e => next(e));
}

module.exports = { load, create, get, remove, list };
