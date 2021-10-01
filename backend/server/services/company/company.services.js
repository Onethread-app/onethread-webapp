const { Company } = require('../../company/company.model');

const companyListFinder = async () => {
  const companyIdList = await Company.find({}).select('_id').exec();
  return companyIdList;
};

module.exports = {
  companyListFinder,
};
