const { Basic } = require('./basic.model');

// Create request formatter
function basicInfoFormatterCreateRequest(bc) {
  return {
    company: bc.company,
    companyName: bc.companyName,
    locationOfReg: bc.locationOfReg,
    companyOperationalAddress: {
      street: bc.companyOperationalAddress.street,
      city: bc.companyOperationalAddress.city,
      country: bc.companyOperationalAddress.country,
      zipCode: bc.companyOperationalAddress.zipCode,
    },
    mainProducts: bc.mainProducts,
    otherProductsYouSell: bc.otherProductsYouSell,
    yearCompanyReg: bc.yearCompanyReg,
    totalEmp: bc.totalEmp,
    companyUrl: bc.companyUrl,
    legalOwner: bc.legalOwner,
    legalMailAddress: bc.legalMailAddress,
    officeSize: bc.officeSize,
    companyAdvantages: bc.companyAdvantages,
  };
}
// Update request formatter
function basicInfoFormatterUpdateRequest(bc) {
  return {
    companyName: bc.companyName,
    locationOfReg: bc.locationOfReg,
    companyOperationalAddress: {
      street: bc.companyOperationalAddress.street,
      city: bc.companyOperationalAddress.city,
      country: bc.companyOperationalAddress.country,
      zipCode: bc.companyOperationalAddress.zipCode,
    },
    mainProducts: bc.mainProducts,
    otherProductsYouSell: bc.otherProductsYouSell,
    yearCompanyReg: bc.yearCompanyReg,
    totalEmp: bc.totalEmp,
    companyUrl: bc.companyUrl,
    legalOwner: bc.legalOwner,
    legalMailAddress: bc.legalMailAddress,
    officeSize: bc.officeSize,
    companyAdvantages: bc.companyAdvantages,
  };
}
// response formatter
function basicInfoFormatterResponse(bc) {
  return {
    id: bc.id,
    company: bc.company,
    companyName: bc.companyName,
    locationOfReg: bc.locationOfReg,
    companyOperationalAddress: {
      street: bc.companyOperationalAddress.street,
      city: bc.companyOperationalAddress.city,
      country: bc.companyOperationalAddress.country,
      zipCode: bc.companyOperationalAddress.zipCode,
    },
    mainProducts: bc.mainProducts,
    otherProductsYouSell: bc.otherProductsYouSell,
    yearCompanyReg: bc.yearCompanyReg,
    totalEmp: bc.totalEmp,
    companyUrl: bc.companyUrl,
    legalOwner: bc.legalOwner,
    legalMailAddress: bc.legalMailAddress,
    officeSize: bc.officeSize,
    companyAdvantages: bc.companyAdvantages,
    createdAt: bc.createdAt,
    updatedAt: bc.updatedAt,
  };
}

// create a Basic Info
const createBasicInfo = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  // storing requested company's id
  req.body.company = req.currentCompany;
  const newBasic = new Basic(
    basicInfoFormatterCreateRequest(req.body),
  );

  newBasic
    .save()
    .then(result => {
      res.status(201).json({
        message: 'New Basic-info created',
        newBasic: basicInfoFormatterResponse(result),
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};
// get a Basic Info
const getBasicInfo = async (req, res) => {
  Basic.findOne({ _id: req.params.id })
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          basicInfo: basicInfoFormatterResponse(result),
        });
      } else {
        res.status(404).json({ message: 'No Basic-info found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

const getAllBasicInfo = async (req, res) => {
  Basic.find({})
    .exec()
    .then(results => {
      if (results) {
        res.status(200).json({
          count: results.length,
          basicInfo: results.map(bc => {
            return basicInfoFormatterResponse(bc);
          }),
        });
      } else {
        res.status(404).json({ message: 'No Basic-info found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// // update a Basic Info
const updateBasicInfo = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  // Unauthorized values
  if (req.body.hasOwnProperty('company')) {
    return res
      .status(401)
      .json({ message: 'Unauthorized value [company]' });
  } else if (req.body.hasOwnProperty('_id')) {
    return res
      .status(401)
      .json({ message: 'Unauthorized value [_id]' });
  }

  // update
  Basic.findOneAndUpdate(
    { _id: req.params.id },
    basicInfoFormatterUpdateRequest(req.body),
  )
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          message: 'Basic-info updated',
        });
      } else {
        res.status(404).json({ message: 'No Basic-info found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
// // delete a Basic Info
const deleteBasicInfo = async (req, res) => {
  Basic.findByIdAndRemove({ _id: req.params.id })
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          message: 'Basic-info deleted',
        });
      } else {
        res.status(404).json({ message: 'No Basic-info found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  createBasicInfo,
  getBasicInfo,
  getAllBasicInfo,
  updateBasicInfo,
  deleteBasicInfo,
};
