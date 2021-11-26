const httpStatus = require('http-status');
const { Associate } = require('./associate.model');

const logger = require('../../config/winston');
const { BadRequestError } = require('../helpers/APIError');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
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
    if (!colResult) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Associate not found',
      });
    }
    if (req.headers.companyid === colResult.company._id.toString()) {
      colResult.company = undefined;
    } else {
      colResult.associateCompany = colResult.company;
      colResult.company = undefined;
    }
    return sendJSONresponse(res, 200, colResult);
  } catch (error) {
    logger.error(`Associate create: ${error}`);
    next(error);
  }
};

const createPending = async (req, res, next) => {
  try {
    const companyId = req.headers.companyid;
    const associateCompanyId = req.body.associateCompanyId;
    let associate = await Associate.findOne({
      company: companyId,
      associateCompany: associateCompanyId,
    });

    if (!associate) {
      associate = await Associate.create({
        company: companyId,
        associateCompany: associateCompanyId,
        account: req.user._id,
      });
    }
    await Associate.populate(associate, {
      path: 'associateCompany',
      select: '_id name type',
    });
    await createPendingAssociateRequest(
      companyId,
      associateCompanyId,
      associate._id,
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
    );
    return sendJSONresponse(res, 201, associate);
  } catch (error) {
    logger.error(`Associate pending: ${error}`);
    next(error);
  }
};

const acceptPending = async (req, res, next) => {
  try {
    let associates = [];
    await Promise.all(
      req.body.associates.map(async (associateId) => {
        let associate = await Associate.findOneAndUpdate(
          { _id: associateId },
          { isAccepted: true },
          { safe: true, upsert: true, new: true },
        ).exec();

        associate = await Associate.populate(associate, {
          path: 'company associateCompany',
          select: '_id name type',
        });
        associates.push(associate);

        if (associate) {
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
        }
      }),
    );

    return sendJSONresponse(res, 200, associates);
  } catch (error) {
    logger.error(`Associate accept: ${error}`);
    next(error);
  }
};

const rejectPending = async (req, res, next) => {
  try {
    await Promise.all(
      req.body.associates.map(async (associateId) => {
        let associate = await Associate.findByIdAndDelete(
          associateId,
        );
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
      }),
    );
    return sendJSONresponse(res, 200, { message: 'rejected' });
  } catch (error) {
    logger.error(`Associate Reject: ${error}`);
    next(error);
  }
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;

  const companyId = req.headers.companyid;
  // console.log({ companyId });
  await Associate.find({
    $or: [{ company: companyId }, { associateCompany: companyId }],
    isAccepted: true,
  })
    .select('_id company associateCompany createdAt')
    .populate('company', '_id name type ')
    .populate('associateCompany', '_id name type ')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      // console.log(result);
      return sendJSONresponse(res, 200, result);
    })
    .catch((e) => next(e));
};

const listPending = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;

  await Associate.find({
    $or: [{ associateCompany: req.headers.companyid }],
    isAccepted: false,
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
  list, // OK
  get,
  listPending, // OK
  createPending, // OK
  acceptPending, // OK
  rejectPending, // OK
};
