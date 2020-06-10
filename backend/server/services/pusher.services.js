const Pusher = require('pusher');
const config = require('../../config/config');

const pusherChannel = new Pusher({
    appId: config.PUSHER_CHANNEL_APP_ID,
    key: config.PUSHER_CHANNEL_KEY,
    secret: config.PUSHER_CHANNEL_SECRET,
    cluster: config.PUSHER_CHANNEL_CLUSTER,
    encrypted: true,
});

module.exports = {
    pusherChannel,
};
