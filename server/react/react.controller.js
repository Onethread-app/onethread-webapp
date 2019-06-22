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
  const react = new React({
    postRef: req.body.postRef,
    ptype: req.body.type,
    account: req.user
  });

  
  let block = [];

  if (req.body.reviewStatus === 'block') {
    block.push(
        serviceReact.reactCount(req.body.refrence, 'Post', react.ptype)
    );
  }

  block.push(react.save());
  Promise.all(block)
    .then(result => res.json(result))
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
