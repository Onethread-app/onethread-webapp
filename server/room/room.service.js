const { chatkit } = require('../services/pusher.services');

async function  addRoom( roomId, roomName, creatorId) {
  return await chatkit
    .createRoom({
      id: roomId,
      creatorId: roomName,
      name: creatorId
    });
}

module.exports = { addRoom };
