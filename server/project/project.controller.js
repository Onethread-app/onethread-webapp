const { Project } = require('./project.model');

// create a project preface
const create = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    req.body.account = req.user._id;
    const newProject = new Project(req.body);

    const project = await newProject.save();

    return res.status(201).json({
      message: 'New project created',
      project,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
};
