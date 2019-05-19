const Comment = require("./comment.model");

function load(req, res, next, id) {
  Comment.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.comment = result;
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
  return res.json(req.comment);
}

function create(req, res, next) {
  const comment = new Comment({
    text: req.body.text,
    postRef: req.body.postRef
  });

  comment
    .save()
    .then(result => res.send(result))
    .catch(e => console.log(e));
}

function list(req, res) {
  const { limit = 50, skip = 0 } = req.query;
  Comment.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec(function(err, result) {
      if (err) {
        return res.status(422).send({
          message: err
        });
      } else {
        res.json(result);
      }
    });
}

function remove(req, res, next) {
  const comment = req.comment;
  comment
    .remove()
    .then(result => res.json(result))
    .catch(e => next(e));
}

module.exports = { load, create, get, load, remove, list };
