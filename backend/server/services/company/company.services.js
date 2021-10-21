const { Company } = require('../../company/company.model');
const { Member } = require('../../company/member/member.model');
const Task = require('../../task/task.model');
const { Project } = require('../../project/project.model');

const companyListFinder = async () => {
  const companyIdList = await Company.find({}).select('_id').exec();
  return companyIdList;
};

const findCompanyById = async (_id) => {
  return await Company.findById({ _id: _id });
};

const companyAdminSuperAdminList = async (_id) => {
  return await Member.find({
    $or: [{ role: 'superAdmin' }, { role: 'admin' }],
    company: _id,
  })
    .select('account')
    .populate('account', '_id');
};
module.exports = {
  companyListFinder,
  findCompanyById,
  companyAdminSuperAdminList,
};
