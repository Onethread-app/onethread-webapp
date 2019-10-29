const Division = require('./designation.model');
const logger = require('../../../config/winston.js');
const { sendJSONresponse } = require('../../helpers/jsonResponse');

const create = async (req, res, next) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return res.send("Expects 'application/json'");
  }
  try {
    // check division already exists with same company
    const duplicate = await Division.findOne({
      name: req.body.name,
      company: req.company._id,
    });
    if (duplicate) {
      logger.info(`Division already exist`);
      return res.status(409).json({
        status: false,
        message: `Division already exists`,
      });
    }

    req.body.company = req.company._id;
    const newDivision = new Division(req.body);
    const division = await newDivision.save();

    // save ref in company
    req.company.divisions.push(division._id);
    await req.company.save();

    const { _id, name } = division;

    return sendJSONresponse(res, 201, {
      success: true,
      division: { _id, name },
    });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res) => {
  try {
    const divisions = await Division.find({
      company: req.company._id,
    }).select('_id name');

    if (divisions) {
      return sendJSONresponse(res, 200, {
        success: true,
        divisions,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'No divisions found.',
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

module.exports = {
  create,
  list,
};
