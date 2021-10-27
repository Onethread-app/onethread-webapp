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
const numOfProjectInACompany = async (companyId) => {
  return Project.countDocuments({
    company: companyId,
    removed: false,
    hasDeleted: false,
  });
};
const allProjectIdOfCompany = async (companyId) => {
  const projects = await Project.find({
    company: companyId,
    hasDeleted: false,
    removed: false,
  }).select('_id');
  return projects.map((p) => p._id);
};

const numbOfTasksOfACompany = async (companyId) => {
  const projectIds = await allProjectIdOfCompany(companyId);
  return Task.countDocuments({
    project: projectIds,
    removed: false,
  });
};

module.exports = {
  companyListFinder,
  findCompanyById,
  numOfProjectInACompany,
  allProjectIdOfCompany,
  numbOfTasksOfACompany,
  companyAdminSuperAdminList,
};
