const Label = require('./label.model');
const TaskLabel = require('./taskLabel.model');
const logger = require('../../config/winston');

const {
  sendErrorResponse,
  sendJSONresponse,
} = require('../helpers/jsonResponse');

const {
  search,
  labelIndex,
  storeLabelInElk,
  deleteLabelFromELKByMongoId,
} = require('../services/elastic.services');

const {
  taskLabelCreation,
} = require('../services/taskLabel/taskLabel.service');

const create = async (req, taskCreated) => {
  const response = [];
  const label = await Label.create({
    name: req.body.name,
    createdBy: req.user._id,
    color: req.body.color,
    description: req.body.description,
    company: req.headers.companyid,
  });
  response.push(label);
  if (taskCreated) {
    const taskLabel = await taskLabelCreation(
      req.body.task,
      label._id,
    );
    response.push(taskLabel);
  }
  await storeLabelInElk(label);
  return response;
};

const createLabel = async (req, res, next) => {
  try {
    const [label, taskLabel] = await create(req, true);
    return sendJSONresponse(res, 200, { label, taskLabel });
  } catch (error) {
    logger.error(`Label Creation: ${error}`);
    next(error);
  }
};

const createForCompany = async (req, res, next) => {
  try {
    const [label] = await create(req, false);
    return sendJSONresponse(res, 200, { label });
  } catch (error) {
    logger.error(`Label Creation: ${error}`);
    next(error);
  }
};

const generateQueryBody = (size, from, termValue, partialSearch) => {
  const queryMust = [];
  if (termValue) {
    queryMust.push({ term: termValue });
  }
  if (partialSearch) {
    queryMust.push({ match_phrase_prefix: partialSearch });
  }

  return {
    size: size,
    from: from,
    query: { bool: { must: queryMust } },
  };
};

const suggestLabel = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    let body = generateQueryBody(
      200,
      0,
      { company: { value: req.headers.companyid } },
      { name: keyword },
    );
    const response = await search(labelIndex, '_doc', body);

    return sendJSONresponse(res, 200, {
      data: response.hits.hits.map((r) => r._source),
    });
  } catch (error) {
    logger.error(`Suggest Label: ${error}`);
    next(error);
  }
};

const getLabelByCompany = async (req, res, next) => {
  try {
    let body = generateQueryBody(200, 0, {
      company: { value: req.headers.companyid },
    });

    const response = await search(labelIndex, '_doc', body);

    return sendJSONresponse(res, 200, {
      data: response.hits.hits.map((r) => r._source),
    });
  } catch (err) {
    logger.error(`Get Company By Labels: ${err}`);
    next(err);
  }
};

const getTaskLabels = async (req, res, next) => {
  try {
    const { task } = req.params;
    const taskLabels = await TaskLabel.find({ task }).populate(
      'label',
      '-createdAt -updatedAt -__v',
    );
    return sendJSONresponse(res, 200, { taskLabels });
  } catch (err) {
    logger.error(`Task Labels: ${err}`);
    next(err);
  }
};

const createTaskLabel = async (req, res, next) => {
  try {
    const queryObject = {
      task: req.params.task,
      label: req.body.label,
    };
    const taskLabel = await TaskLabel.findOne(queryObject);
    if (taskLabel) {
      await TaskLabel.deleteOne(queryObject);
      return sendJSONresponse(res, 200, { message: 'label deleted' });
    } else {
      await TaskLabel.create(queryObject);
      return sendJSONresponse(res, 201, { message: 'label created' });
    }
  } catch (error) {
    logger.error(`Task Label Creation: ${error}`);
    next(error);
  }
};

const labelDetails = async (req, res, next) => {
  try {
    const label = await Label.findById(req.params.label);
    if (!label) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Label not found',
      });
    }
    return sendJSONresponse(res, 200, { label });
  } catch (err) {
    logger.error(`Label details: ${err}`);
    next(err);
  }
};

const updateLabel = async (req, res, next) => {
  try {
    const { name, color, description } = req.body;
    const label = await Label.findOne({
      _id: req.params.label,
      company: req.headers.companyid,
    });
    if (!label) {
      return sendErrorResponse(res, 404, 'NotFound', {
        message: 'Label not found',
      });
    }
    const isNameExists = await Label.findOne({
      name: name,
      company: req.headers.companyid,
    });
    if (!isNameExists) {
      const [newLabel, taskLabel] = await create(req);
      return sendJSONresponse(res, 201, {
        message: 'label created',
        label: newLabel,
        taskLabel,
      });
    }
    const updatedLabel = await Label.findByIdAndUpdate(
      { _id: label._id },
      { $set: { name, color, description } },
      { safe: true, upsert: true, new: true },
    );
    await deleteLabelFromELKByMongoId(label._id);
    await storeLabelInElk(label);

    return sendJSONresponse(res, 200, {
      message: 'label updated',
      label: updatedLabel,
    });
  } catch (err) {
    logger.error(`Label Update: ${err}`);
    next(err);
  }
};

const deleteLabel = async (req, res, next) => {
  try {
    await TaskLabel.deleteOne({ _id: req.params.taskLabel });
    return sendJSONresponse(res, 200, { message: 'label deleted' });
  } catch (error) {
    logger.error(`Label Deletion: ${error}`);
    next(error);
  }
};

module.exports = {
  createLabel,
  deleteLabel,
  suggestLabel,
  updateLabel,
  labelDetails,
  getTaskLabels,
  createTaskLabel,
  getLabelByCompany,
  createForCompany,
};
