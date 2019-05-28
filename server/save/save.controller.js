const Save = require("./save.model");

function load(req, res, next, id) {
  Save.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.save = result;
        return next();
      } else {
        return res
          .status(400)
          .json({ message: "No valid entry found for provided ID" });
      }
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
  const save = new Save({
    postRef: req.body.postRef
  });

  save
    .save()
    .then(result => res.send(result))
    .catch(e => next(e));
}

function list(req, res) {
  const { limit = 50, skip = 0 } = req.query;
  Save.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec(function(err, resultes) {
      if (err) {
        return res.status(422).send({
          message: err
        });
      } else {
        res.json(resultes);
      }
    });
}

function remove(req, res, next) {
  const save = req.save;
  save
    .remove()
    .then(result => res.json(result))
    .catch(e => next(e));
}

module.exports = { load, create, get, load, remove, list };
