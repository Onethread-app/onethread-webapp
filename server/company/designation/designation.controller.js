const { Designation } = require('./designation.model.js');
const { Member } = require('./../member/member.model');
const logger = require('../../../config/winston.js');
const { sendJSONresponse } = require('../../helpers/jsonResponse');

const create = async (req, res, next) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }
  try {
    let divisions = ['director', 'cxo'],
      body = req.body;
    if (divisions.includes(req.body.division)) {
      delete body.department;
    }

    body.member = req.params.memberId;
    body.account = req.user._id;

    const newDesignation = new Designation(body);
    const designation = await newDesignation.save();

    // save ref in member
    req.member.designations.push(designation._id);
    await req.member.save();

    return sendJSONresponse(res, 201, {
      success: true,
      designation,
    });
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }
  try {
    // find designation
    const designation = await Designation.findOne({
      _id: req.body.designation,
    });

    // if not found
    if (!designation) {
      return sendJSONresponse(res, 404, {
        message: 'No designation found',
      });
    }

    // check division
    let checkDivisions = ['director', 'cxo'];

    if (checkDivisions.includes(req.body.division)) {
      designation.department = undefined;
    } else {
      designation.department = req.body.department;
    }

    // update designation
    designation.division = req.body.division;
    designation.position = req.body.position;
    await designation.save();

    return sendJSONresponse(res, 200, {
      success: true,
      designation,
    });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const designations = await Designation.find({
      member: req.params.memberId,
      removed: false,
    });

    if (designations.length) {
      return sendJSONresponse(res, 200, {
        success: true,
        designations,
      });
    }

    return sendJSONresponse(res, 404, {
      message: 'No designations found',
    });
  } catch (error) {
    next(error);
  }
};

// member will be found on req.member
const load = async (req, res, next) => {
  try {
    const member = await Member.findOne({
      _id: req.params.memberId,
    });
    if (member) {
      req.member = member;
      return next();
    } else {
      return res.status(404).json({
        message: 'No valid entry found for provided Member ID',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
  edit,
  load,
};
