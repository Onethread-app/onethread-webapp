const Report = require('./report.model');

const serviceReport = require('./report.service');
//const Promise = require('bluebird');

const load = (req, res, next, id) => {
  Report.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.report = result;
        return;
      } else {
        return res
          .status(400)
          .json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch(err => {
      // console.log(err);
      next(err);
    })
    .asCallback(next);
}

const get = (req, res) => {
  return res.json(req.report);
}

const create = (req, res, next) => {
  const { refType = 'post' } = req.query;
  const report = new Report({
    reportContent: req.body.reportContent,
    reportType: req.body.reportType,
    [refType]: req.body.refrence,
    text: req.body.text,
    account: req.user
  });

  report
    .save()
    .then(result => res.send(result))
    .catch(e => next(e));
}

const list = (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  Report.find({ removed: false })
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

const review = (req, res, next) => {
  const report = req.report;
  report.reviewStatus = req.body.reviewStatus;
  report.reviewText = req.body.reviewText;
  let block = [];

  if (req.body.reviewStatus === 'block') {
    block.push(
      serviceReport.reviewAction(req.body.refrence, report.reportContent[0])
    );
  }

  block.push(report.save());
  Promise.all(block)
    .then(result => res.json(result))
    .catch(e => next(e));
}

const remove = (req, res, next) => {
  const report = req.report;
  report.removed = true;

  report
    .remove()
    .then(result => res.json(result))
    .catch(e => next(e));
}

module.exports = { load, create, get, remove, list, review };
