const chatkitService = require('../services/pusher.services');

const auth = async (req, res) => {
  const authData = chatkitService.chatkit.authenticate({
    userId: req.query.email,
  });
  return res.status(authData.status).send(authData.body);
};

module.exports = { auth };
