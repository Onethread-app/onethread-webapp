const Chatkit = require('@pusher/chatkit-server');
const Pusher = require('pusher');
const config = require('../../config/config');

const chatkit = new Chatkit.default({
  instanceLocator: config.instanceLocator,
  key: config.pusherKey,
});

const pusherChannel = new Pusher({
  appId: '976471',
  key: '7e706af4c123d518ccb5',
  secret: '14a1635ad7608a2fdc41',
  cluster: 'ap1',
  useTLS: true,
});

module.exports = {
  chatkit,
  pusherChannel,
};
