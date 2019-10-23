const Department = require('./department.model');
const logger = require('../../../config/winston.js');
const { sendJSONresponse } = require('../../helpers/jsonResponse');

const create = async (req, res) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return res.send("Expects 'application/json'");
  }
  try {
    // check Department already exists with same company
    const duplicate = await Department.findOne({
      name: req.body.name,
      company: req.company._id,
    });
    if (duplicate) {
      logger.info(`Department already exist`);
      return res.status(409).json({
        status: false,
        message: `Department already exists`,
      });
    }

    req.body.company = req.company._id;
    const newDepartment = new Department(req.body);
    const department = await newDepartment.save();

    // save ref in company
    req.company.departments.push(department._id);
    await req.company.save();

    const { _id, name } = department;

    return sendJSONresponse(res, 201, {
      success: true,
      department: { _id, name },
    });
  } catch (err) {
    logger.error(` process:${process.pid} Bad request : ${err}`);
    return sendJSONresponse(res, 400, {
      success: false,
      message: 'could not create',
      reason: err,
    });
  }
};

const list = async (req, res) => {
  try {
    const departments = await Department.find({
      company: req.company._id,
    }).select('_id name');

    if (departments) {
      return sendJSONresponse(res, 200, {
        success: true,
        departments,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'No departments found.',
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
