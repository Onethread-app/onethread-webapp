const Comment = require('./comment.model');
const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');

const load = (req, res, next, id) => {
  Comment.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        req.comment = result;
        return next();
      }
      return res
        .status(400)
        .json({ message: 'No valid entry found for provided ID' });
    })
    .catch((err) => {
      next(err);
    });
};

const create = async (req, res, next) => {
  const comment = new Comment({
    text: req.body.text,
    account: req.user._id,
    taskId: req.body.taskId,
  });

  comment
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((error) => next(error));
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const comments = await Comment.find({ taskId: req.query.taskId })
    .select('_id text account createdAt')
    .populate([
      {
        path: 'account',
        select: '_id firstName lastName profileImage position',
      },
    ])
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()

    return sendJSONresponse(res,200,comments);
    
  } catch (error) {
    logger.error(`Comment: ${error}`);
    next(error);
  }
};

module.exports = {
  load,
  create,
  list,
};
