const Chatkit = require('@pusher/chatkit-server');
const config = require('../../config/config');

const chatkit = new Chatkit.default({
  instanceLocator: config.instanceLocator,
  key: config.pusherKey,
});

module.exports = {
  chatkit,
};
