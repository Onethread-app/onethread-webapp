const { chatkit } = require('../services/pusher.services');

const authenticate = async (req, res, next) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id,
  });
  res.status(authData.status).send(authData.body);
};

module.exports = {
  authenticate,
};
