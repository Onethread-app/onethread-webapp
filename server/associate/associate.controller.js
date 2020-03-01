const httpStatus = require('http-status');
const Associate = require('./associate.model');


const logger = require('../../config/winston');
const {  BadRequestError } = require('../helpers/APIError');
const { sendJSONresponse } = require('../helpers/jsonResponse');


const get = async (req, res , next) => {
  cancelAnimationFrame
  
  await Associate.findOne({
    _id: req.params.associteId,
    removed: false,
  })
    .select('_id company associateWith createdAt')
    .populate('associateWith', '_id name type')
    .populate('company', '_id name type')
    .exec()
    .then(colResult => {
      res.json(colResult);
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
    await associate
      .save();
      //await Associate.populate(associate, { path: 'associateWith', select: 'name '});
      await associate.populate('associateWith', '_id name type').execPopulate;
      return res.status(201).json(associate);
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
    .select('_id company associateWith createdAt')
    .populate('company', '_id name type ')
    .populate('associateWith', '_id name type ')
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
