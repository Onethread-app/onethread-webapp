const httpStatus = require('http-status');
const Associate = require('./associate.model');


const logger = require('../../config/winston');
const {  BadRequestError } = require('../helpers/APIError');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const { log } = require('debug');



const get = async (req, res , next) => {
  
  
  await Associate.findOne({
    _id: req.params.associteId,
    removed: false,
  })
    .select('_id company associateCompany createdAt account')
    .populate('associateCompany', '_id name type address email legalOwnerName legalOwnerMail')
    .populate('company', '_id name type address email legalOwnerName legalOwnerMail')
    .populate('account', 'firstName lastName')
    .exec()
    .then(colResult => {
      if(req.params.companyId === colResult.company._id.toString()){
        
         colResult.company = undefined;
      }else{
        colResult.associateCompany = colResult.company;
        colResult.company = undefined;
      }
      
      res.json(colResult);
    })
    .catch(e => next(e));
};

const create = async (req, res, next) => {
  
  try {

    const associate = new Associate({
        company: req.body.companyId,
        associateCompany : req.body.associateCompany,
        account: req.user._id,
    });
    await associate
      .save();
      await Associate.populate(associate, { path: 'associateCompany', select: '_id name type'});
      //await associate.populate('associateCompany', '_id name type').execPopulate;
      
      return res.status(201).json(associate);
  } catch (error) {
    console.log(error);
    logger.error(`Board create: ${error}`);
    
    next(error);
  }
};




const list = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;

  await Associate.find(
    { $or:[ {company: companyId}, {associateCompany: companyId}]}
    
  )
    .select('_id company associateCompany createdAt')
    .populate('company', '_id name type ')
    .populate('associateCompany', '_id name type ')
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
