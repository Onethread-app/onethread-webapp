'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Account = require('../account/account.model');
const { Company } = require('./company.model');
const errorHandler = require('../helpers/mongooseErrorFormat');

// Create request formatter
function requestFormatter(req) {
  return {
    companyName: req.body.companyName,
    companyType: req.body.companyType,
    companyAddress: req.body.companyAddress,
    companyMail: req.body.companyMail,
    legalOwnerName: req.body.legalOwnerName,
    legalOwnerMail: req.body.legalOwnerMail,
    account: req.user._id,
  };
}
function responseFormatter(c) {
  return {
    _id: c._id,
    account: c.account,
    companyName: c.companyName,
    companyType: c.type,
    companyAddress: c.companyAddress,
    companyMail: c.companyMail,
    legalOwnerName: c.legalOwnerName,
    legalOwnerMail: c.legalOwnerMail,
  };
}

// create a company profile
const createCompany = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  const account = await Account.findById(req.user._id);
  if (!account) {
    return res.status(404).json({
      status: false,
      message: 'No user found with this token',
    });
  }
  const newCompany = new Company(requestFormatter(req));

  try {
    const company = await newCompany.save();
    account.companies.push(newCompany._id);
    await account.save();
    return res.status(201).json({
      status: true,
      message: 'New company created',
      newCompany: responseFormatter(company),
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

// get a company profile
const getCompany = async (req, res) => {
  Company.findById(req.params.id)
    .populate('account', '_id firstName lastName email contactNo')
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          company: responseFormatter(result),
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: 'No company found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// update a company profile
const updateCompany = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }
  Company.findOneAndUpdate({ _id: req.params.id }, req.body)
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          message: 'Company updated',
        });
      } else {
        res.status(404).json({ message: 'No company found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// delete a company profile
const deleteCompany = async (req, res) => {
  Company.findByIdAndRemove({ _id: req.params.id })
    .exec()
    .then(result => {
      if (result) {
        //Store this company's ref into Account
        Account.findOneAndUpdate(
          { _id: req.user._id },
          { $pull: { companies: req.params.id } },
          {
            safe: true,
            upsert: true,
          },
        )
          .exec()
          .then(data => {
            res.status(200).json({
              message: 'Company deleted',
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(404).json({ message: 'No company found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
};
