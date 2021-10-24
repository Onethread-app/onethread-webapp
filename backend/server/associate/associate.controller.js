const httpStatus = require('http-status');
const { Associate } = require('./associate.model');

const logger = require('../../config/winston');
const { BadRequestError } = require('../helpers/APIError');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const { log } = require('debug');
const _ = require('lodash');
const {
  createPendingAssociateRequest,
  rejectAssociateRequest,
  acceptAssociateRequest,
} = require('../notification/notification.controller');
const {
  associateIndex,
  setDocument,
} = require('../services/elastic.services');
const {
  findByAssociateId,
} = require('../services/associate/associate.service');
const chalk = require('chalk');

const get = async (req, res, next) => {
  try {
    const colResult = await findByAssociateId(req.params.associateId);
    if (req.params.companyId === colResult.company._id.toString()) {
      colResult.company = undefined;
    } else {
      colResult.associateCompany = colResult.company;
      colResult.company = undefined;
    }
    return sendJSONresponse(res, 200, colResult);
  } catch (error) {
    logger.error(`Associate create: ${e}`);
    next(e);
  }
};

const createPending = async (req, res, next) => {
  try {
    const companyId = req.body.company._id;
    const assoId = req.body.associateCompany._id;
    let associate = await Associate.findOne({
      company: companyId,
      associateCompany: assoId,
      isAccepted: false,
      isRejected: true,
    });

    if (_.isEmpty(associate)) {
      console.log(associate);
      associate = new Associate({
        company: companyId,
        associateCompany: assoId,
        isAccepted: false,
        isRejected: false,
        account: req.user._id,
      });
      await associate.save();
    } else {
      associate.isRejected = false;
      await associate.save();
    }
    await Associate.populate(associate, {
      path: 'associateCompany',
      select: '_id name type',
    });
    await createPendingAssociateRequest(
      companyId,
      assoId,
      associate._id,
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
    );
    return sendJSONresponse(res, 201, associate);
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
      { isAccepted: true, isRejected: false },
      { safe: true, upsert: true, new: true },
    ).exec();

    associate = await Associate.populate(associate, {
      path: 'company associateCompany',
      select: '_id name type',
    });

    await setDocument(associateIndex, '_doc', {
      mongo_id: associate._id,
      company_id: associate.company._id,
      companyName: associate.company.name,
      associateCompany_id: associate.associateCompany._id,
      associateCompanyName: associate.associateCompany.name,
    });

    logger.info(
      chalk.blueBright(
        `Elasticsearch document added on ${associateIndex}`,
      ),
    );
    await acceptAssociateRequest(
      req.headers.companyid,
      associate.company,
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
    );
    return sendJSONresponse(res, 200, associate);
  } catch (error) {
    logger.error(`Associate accept: ${error}`);
    next(error);
  }
};

const rejectPending = async (req, res, next) => {
  try {
    let associate = await Associate.findOneAndUpdate(
      { _id: req.body.associateId },
      { isRejected: true },
      { safe: true, upsert: true, new: true },
    ).exec();

    associate = await Associate.populate(associate, {
      path: 'associateCompany',
      select: '_id name type',
    });
    await rejectAssociateRequest(
      req.headers.companyid,
      associate.company,
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
    );
    logger.info(`successfully rejected`);
    return sendJSONresponse(res, 200, { remove: true });
  } catch (error) {
    logger.error(`Associate Reject: ${error}`);
    next(error);
  }
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;

  await Associate.find({
    $or: [
      { company: req.params.companyId },
      { associateCompany: req.params.companyId },
    ],
    isAccepted: true,
    removed: false,
    isRejected: false,
  })
    .select('_id company associateCompany createdAt')
    .populate('company', '_id name type ')
    .populate('associateCompany', '_id name type ')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      return sendJSONresponse(res, 200, result);
    })
    .catch((e) => next(e));
};

const listPending = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;

  await Associate.find({
    $or: [{ associateCompany: req.params.companyId }],
    isAccepted: false,
    removed: false,
    isRejected: false,
  })
    .select('_id company associateCompany createdAt')
    .populate('company', '_id name type about')
    .populate('associateCompany', '_id name type about')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      return sendJSONresponse(res, 200, result);
    })
    .catch((e) => {
      next(e);
    });
};

module.exports = {
  list,
  get,
  listPending,
  createPending,
  acceptPending,
  rejectPending,
};
