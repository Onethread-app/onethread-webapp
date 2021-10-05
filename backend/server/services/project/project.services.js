const { Project } = require('../../project/project.model');

const projectListInCompany = async (cid) => {
  const projectList = await Project.find({ company: cid }).select(
    '_id',
  );
  return projectList;
};
module.exports = {
  projectListInCompany,
};
