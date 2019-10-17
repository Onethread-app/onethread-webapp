// const { Team } = require('./team.model');

// add team member
const addMember = async (req, res) => {
  return res.status(200).json({
    status: true,
    company: req.company.name,
    body: req.body,
  });
};

module.exports = {
  addMember,
};
