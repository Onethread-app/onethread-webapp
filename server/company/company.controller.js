'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Account = require('../account/account.model');
const { Company } = require('../company/company.model');
const errorHandler = require('../helpers/mongooseErrorFormat');
// Create request formatter
function companyRequestFormatter(req) {
  return {
    companyName: req.body.companyName,
    type: req.body.type,
    logo: req.body.logo,
    location: req.body.location,
    account: req.user._id,
    products: req.body.products,
    companyUrl: req.body.companyUrl,
    companyMail: req.body.companyMail,
    companyOperationalAddress: req.body.companyOperationalAddress,
    legalOwnerName: req.body.legalOwnerName,
    legalOwnerMail: req.body.legalOwnerMail
  };
}

// create User
const createUser = async (req, res) => {
  const account = new Account({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    contactNo: req.body.contactNo,
    role: req.body.role
  });
  try {
    let newUser = await account.save();
    let token = await account.generateJwt();
    req.user = newUser;
    req.token = token;
    let a = {
      error: null,
      status: true
    };
    return a;
  } catch (err) {
    let a = {
      error: err,
      status: false
    };
    if (err.code == 11000 || err.code == 11001) {
      a.error = errorHandler.getErrorMessage(err);
    }
    return a;
  }
};

// create a company profile
const createCompanyProfile = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  // stage 2 check
  if (req.body.stage2) {
    // check token
    try {
      let payload = jwt.verify(req.body.token, config.jwtSecret);

      let user = await Account.findById(payload._id);
      let token = req.body.token;
      req.user = user;
      req.token = token;
    } catch (err) {
      return res.status(400).json(err);
    }
  } else {
    // create User
    let result = await createUser(req, res);
    // check any error occurs or not
    if (!result.status) {
      return res.status(500).json({
        error: result.error
      });
    }
  }

  // creating a profile for company

  const newCompany = new Company(companyRequestFormatter(req));

  newCompany
    .save()
    .then(result => {
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
              owner: {
                id: result.account,
                token: req.token
              },
              createdAt: result.createdAt,
              updatedAt: result.updatedAt
            }
          });
        })
        .catch(err => {
          return res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      if (err.code == 11000 || err.code == 11001) {
        return res.status(500).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      return res.status(500).json({
        error: err
      });
    });
};

// get a company profile
const getCompanyProfile = async (req, res) => {
  Company.findById(req.params.id)
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
