const React = require('./react.model');
const serviceReact = require('./react.service');

function load(req, res, next, id) {
  React.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.react = result;
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

//later will change to task manager
function create(req, res, next) {
  let typeCount = 'likeCount';
  let listPromise = [];
  const react = new React({
    postRef: req.body.postRef,
    reactType: req.body.reactType,
    refType: req.body.refType,
    account: req.user
  });

  listPromise.push(react.save());
  if (req.query.type === 'respect') {
    typeCount = 'respectCount';
  }
  listPromise.push(
    serviceReact.reactCount(react.postRef, react.refType, typeCount)
  );
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

function listReference(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  React.find({ removed: false, postRef: req.params.id })
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

module.exports = { load, create, get, remove, listReference, list };
