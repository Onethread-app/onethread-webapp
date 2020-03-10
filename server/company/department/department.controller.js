const Department = require('./department.model');
const logger = require('../../../config/winston.js');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../../helpers/jsonResponse');

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
      return sendErrorResponse(res, 409, 'DuplicateKeyError', {
        message: 'Department already exists',
        fieldName: 'name',
      });
    }

    req.body.company = req.company._id;
    const newDepartment = new Department(req.body);
    const department = await newDepartment.save();

    // save ref in company
    req.company.departments.push(department._id);
    await req.company.save();

    return sendJSONresponse(res, 201, {
      department: {
        _id: department._id,
        name: department.name,
      },
    });
  } catch (err) {
    logger.error(` process:${process.pid} Bad request : ${err}`);
    return sendErrorResponse(res, 400, '', {
      message: 'Failed to create new department',
      fieldName: 'name',
    });
  }
};

const list = async (req, res, next) => {
  
  try {
    const departments = await Department.find({
      company: req.params.companyId,
      removed: false,
    }).select('_id name');

    if (departments) {
      return sendJSONresponse(res, 200, {
        departments,
      });
    }

    return res.status(404).json({
      message: 'No departments found.',
    });
  } catch (error) {
   
    next(error)
  }
};

module.exports = {
  create,
  list,
};
