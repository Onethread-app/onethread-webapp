const { pusherChannel } = require('../services/pusher.services');

const authenticate = async (req, res, next) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  const { _id, email, name } = req.user;

  const presenceData = {
    user_id: _id,
    user_info: { email, name },
  };
  const auth = pusherChannel.authenticate(
    socketId,
    channel,
    presenceData,
  );
  
  res.send(auth);
};

module.exports = {
  authenticate,
};
