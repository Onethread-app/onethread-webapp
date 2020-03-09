const httpStatus = require('http-status');
const {Associate} = require('./associate.model');


const logger = require('../../config/winston');
const {  BadRequestError } = require('../helpers/APIError');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const { log } = require('debug');



const get = async (req, res , next) => {
  
  
  await Associate.findOne({
    _id: req.params.associateId,
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
    .catch(e => {
      logger.error(`Associate create: ${e}`);
      next(e)
    });
};

const createPending = async (req, res, next) => {
  
  try {

    const associate = new Associate({
        company: req.body.companyId,
        associateCompany : req.body.associateCompany,
        isAccepted: false,
        account: req.user._id,
    });
    await associate
      .save();
      await Associate.populate(associate, { path: 'associateCompany', select: '_id name type'});
      //await associate.populate('associateCompany', '_id name type').execPopulate;
      
      return res.status(201).json(associate);
  } catch (error) {
    console.log(error);
    logger.error(`Associate pending: ${error}`);
    
    next(error);
  }
};

const acceptPending = async (req, res, next) => {
  
  try {
    
    let associate = await Associate.findOneAndUpdate(
      { _id: req.body.associateId },
      {   isAccepted: true  },
      { safe: true, upsert: true, new: true },
    ).exec();
      
    associate = await Associate.populate(associate, { path: 'associateCompany', select: '_id name type'});
      
      return res.status(200).json(associate);
  } catch (error) {
    console.log(error);
    logger.error(`Associate accept: ${error}`);
    
    next(error);
  }
};

const rejectPending = async (req, res, next) => {
  try {
    //console.log();
    let associate = await Associate.findOneAndUpdate(
      { _id: req.body.associateId },
        { removed: true  },
      { safe: true, upsert: true, new: true },
    ).exec();
     console.log(associate); 
    associate = await Associate.populate(associate, { path: 'associateCompany', select: '_id name type'});
      
    return res.status(200).json({   remove: true  });
  } catch (error) {
    console.log(error);
    logger.error(`Associate accept: ${error}`);
    
    next(error);
  }
};





const list = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;

  await Associate.find(
    { 
      $or:[ {company: req.params.companyId}, {associateCompany: req.params.companyId}],
      isAccepted: true , removed:false
    }
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

const listPending = async (req, res, next) => {
  console.log(req.params.companyId);
  const { limit = 50, skip = 0 } = req.query;

  await Associate.find(
    { 
      $or:[  {associateCompany: req.params.companyId}],
      isAccepted: false , removed:false
    }
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
    .catch(e => {
      
      next(e)}
    );
};

module.exports = {
  list,
  get,
  listPending,
  createPending,
  acceptPending,
  rejectPending,
};
