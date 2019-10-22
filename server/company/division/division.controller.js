const Division = require('./division.model');
const logger = require('../../../config/winston.js');
const { sendJSONresponse } = require('../../helpers/jsonResponse');

const newDivision = async (req, res) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return res.send("Expects 'application/json'");
  }
  try {
    const duplicate = await Division.findOne({
      name: req.body.name,
      company: req.company._id,
    });
    // check user already exists with same company
    if (duplicate) {
      logger.info(`Division already exist`);
      return res.status(409).json({
        status: false,
        message: `Division already exists`,
      });
    }
    const division = new Division();

    division.name = req.body.name;
    division.company = req.company._id;
    const divisions = await division.save();

    // save ref in company
    req.company.divisions.push(divisions._id);
    await req.company.save();
    return sendJSONresponse(res, 201, { success: true });
  } catch (err) {
    logger.error(` process:${process.pid} Bad request : ${err}`);
    return sendJSONresponse(res, 400, {
      success: false,
      message: 'could not create',
      reason: err,
    });
  }
};

const divisionList = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  Division.find({})

    .skip(+skip)
    .limit(+limit)
    .then(results => {
      if (results) {
        return sendJSONresponse(res, 200, {
          success: true,
          DivisionList: results,
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
  newDivision,
  divisionList,
};
