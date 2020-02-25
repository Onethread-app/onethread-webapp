const httpStatus = require('http-status');
const Associate = require('./associate.model');


const logger = require('../../config/winston');
const {  BadRequestError } = require('../helpers/APIError');
const { sendJSONresponse } = require('../helpers/jsonResponse');


const get = async (req, res , next) => {
  const boardObj = await Board.findById(req.board._id)
    .populate('members', '_id name color')
    .exec()
    .then(result => result)
    .catch(err => {
      next(err);
    });
  await BoardColumn.find({
    boardId: req.board._id,
    removed: false,
  })
    .select('_id name tasks positionInBoard')
    .populate('tasks', '_id name color description dueDate')
    .exec()
    .then(colResult => {
      const responseResult = {
        _id: boardObj._id,
        name: boardObj.name,
        description: boardObj.description,
        members: boardObj.members,
        columns: colResult,
      };
      res.json(responseResult);
    })
    .catch(e => next(e));
};

const create = async (req, res, next) => {
  try {
    const associate = new Associate({
        company: req.body.companyId,
        associateWith : req.body.associateWith,
        account: req.user._id,
    });
    associate
      .save()
      .then(createdAssociate => {
        return res.status(201).json(createdAssociate);
      })
      .catch(e => next(e));
  } catch (error) {
    logger.error(`Board create: ${error}`);
    const err = new BadRequestError(
      'board data is invalid.',
      httpStatus.BAD_REQUEST,
    );
    next(err);
  }
};




const list = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;

  await Associate.find({
    company: companyId,
  })
    .select('_id company associateWith')
    .populate('company', '_id name')
    .populate('associateWith', '_id name')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => {
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch(e => next(e));
};

module.exports = {
  list,
  get,
  create,
};
