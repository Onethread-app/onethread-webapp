const { Project } = require('../../project/project.model');

const projectListInCompany = async (cid) => {
  const projectList = await Project.find({ company: cid }).select(
    '_id',
  );
  return projectList;
};
const projectDetails = async (pid) => {
  return await Project.find({ _id: pid }).select('name');
};
module.exports = {
  projectListInCompany,
  projectDetails,
};
