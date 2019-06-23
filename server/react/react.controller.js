const React = require('./react.model');
const serviceReact = require('./react.service');

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
  let typeCount = 'likeCount';
  let listPromise = [];
  const react = new React({
    postRef: req.body.postRef,
    ptype: req.body.type,
    account: req.user
  });

  listPromise.push(react.save());
  if (req.query.type === 'respect') {
    typeCount = 'respectCount';
  }
  listPromise.push(serviceReact.reactCount(react.postRef, typeCount));
  Promise.all(listPromise)
    .then(result => res.json(result[0]))
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
