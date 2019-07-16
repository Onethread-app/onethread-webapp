'use strict';
const Account = require('../account/account.model');
const { Company } = require('../company/company.model');

// create a company profile
const createCompanyProfile = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  // creating a profile for company
  const { type } = req.body;
  const newCompany = new Company({ type, account: req.user._id });

  newCompany
    .save()
    .then(async result => {
      //Store this company's ref into Account
      Account.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { companies: result._id } },
        {
          safe: true,
          upsert: true
        }
      )
        .exec()
        .then(data => {
          res.status(201).json({
            message: 'New company created',
            newCompany: {
              id: result.id,
              type: result.type,
              account: result.account,
              createdAt: result.createdAt,
              updatedAt: result.updatedAt
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

// get a company profile
const getCompanyProfile = async (req, res) => {
  Company.findById(req.params.id)
    .select('_id type account createdAt updatedAt')
    .populate('account')
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          company: {
            id: result.id,
            type: result.type,
            account: {
              id: result.account.id,
              email: result.account.email,
              role: result.account.role,
              companies: result.account.companies
            },
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
          }
        });
      } else {
        res.status(404).json({ message: 'No company found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// update a company profile
const updateCompanyProfile = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }
  Company.findOneAndUpdate({ _id: req.params.id }, req.body)
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          message: 'Company updated'
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
const deleteCompanyProfile = async (req, res) => {
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
            upsert: true
          }
        )
          .exec()
          .then(data => {
            res.status(200).json({
              message: 'Company deleted'
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
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
  createCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile
};
