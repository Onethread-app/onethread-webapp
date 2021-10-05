const { Company } = require('../../company/company.model');

const companyListFinder = async () => {
  const companyIdList = await Company.find({}).select('_id').exec();
  return companyIdList;
};

const findCompanyById = async (_id) => {
  return await Company.findById({ _id: _id });
};
module.exports = {
  companyListFinder,
  findCompanyById
};
