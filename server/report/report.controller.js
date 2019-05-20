const Report = require("./report.model");

function load(req, res, next, id) {
    Report.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.report = result;
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
  return res.json(req.report);
}

function create(req, res, next) {
    const { refType = 'postRef' } = req.query;
  const report = new Report({
    [refType]: req.body.postRef,
    text: req.body.text
  });

  report
    .save()
    .then(result => res.send(result))
    .catch(e => next(e));
}

function list(req, res) {
  const { limit = 50, skip = 0 } = req.query;
  Report.find()
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec(function(err, results) {
      if (err) {
        return res.status(422).send({
          message: err
        });
      } else {
        res.json(results);
      }
    });
}

function remove(req, res, next) {
  const report = req.report;
  report
    .remove()
    .then(result => res.json(result))
    .catch(e => next(e));
}

module.exports = { load, create, get, load, remove, list };
