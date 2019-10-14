const Account = require('../account/account.model');
const { Company } = require('./company.model');

// Create request formatter
function requestFormatter(req) {
  return {
    name: req.body.name,
    type: req.body.type,
    address: req.body.address,
    email: req.body.email,
    legalOwnerName: req.body.legalOwnerName,
    legalOwnerMail: req.body.legalOwnerMail,
    account: req.user._id,
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
      company,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

// add employees
const addEmployees = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  // TODO: some minor checking
  Company.update(
    { name: req.params.cname },
    {
      $addToSet: {
        employees: { $each: req.body.employees },
      },
    },
  )
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          status: true,
          message: 'New employees added',
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

// get a company profile
const getCompany = async (req, res) => {
  return res.status(200).json({
    status: true,
    company: req.company,
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
          status: true,
          message: 'Company updated',
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
              status: true,
              message: 'Company deleted',
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err,
            });
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

const getCompanyLoad = (req, res, next) => {
  Company.find({ name: req.params.cname })
    .populate('account', '_id firstName lastName email contactNo')
    .exec()
    .then(company => {
      if (company) {
        req.company = company[0];
        return next();
      } else {
        return res.status(404).json({
          status: false,
          message: 'No valid entry found for provided Company ID',
        });
      }
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  addEmployees,
  getCompanyLoad,
};
