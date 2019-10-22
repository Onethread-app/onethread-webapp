const Department = require('./department.model');
const logger = require('../../../config/winston.js');
const { sendJSONresponse } = require('../../helpers/jsonResponse');

const newDept = async (req, res) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return res.send("Expects 'application/json'");
  }
  try {
    const duplicate = await Department.findOne({
      name: req.body.name,
      company: req.company._id,
    });
    // check user already exists with same company
    if (duplicate) {
      logger.info(`Department already exist`);
      return res.status(409).json({
        status: false,
        message: `Department already exists`,
      });
    }
    const dept = new Department();

    dept.name = req.body.name;
    dept.company = req.company._id;
    const department = await dept.save();

    // save ref in company
    req.company.departments.push(department._id);
    await req.company.save();
    return sendJSONresponse(res, 201, {
      success: true,
      department: req.company.departments,
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

const deptList = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  Department.find({})

    .skip(+skip)
    .limit(+limit)
    .then(results => {
      if (results) {
        return sendJSONresponse(res, 200, {
          success: true,
          DepartmentList: results,
        });
      } else {
        res.status(404).json({ message: 'No Basic-info found' });
      }
    })
    .catch(err => {
      return next(err);
    });
};

module.exports = {
  newDept,
  deptList,
};
