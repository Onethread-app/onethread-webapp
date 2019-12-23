const { Message } = require('./message.model');
const { Room } = require('./../room/room.model');
const { chatkit } = require('../services/pusher.services');

const create = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  try {
    const room = await Room.findById(req.body.room);
    if (!room) {
      return res.status(404).json({
        status: false,
        message: `No room exists`,
      });
    }

    const message = new Message({
      text: req.body.text,
      room: req.body.room,
      type: req.body.type,
      account: req.user._id,
    });
    await message.save();

    //send to chatkit-server
    await chatkit.sendSimpleMessage({
      userId: message.account,
      roomId: message.room,
      text: message.text,
    });

    return res.status(201).json({
      status: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error,
    });
  }
};

const getRoomMessages = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({
        status: false,
        message: `No room exists`,
      });
    }

    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({
      room: req.params.roomId,
      removed: false,
    })
      .sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit);
    // .select('-__v -company -createdAt -updatedAt')
    // .populate([
    //   { path: 'account', select: '_id name firstName lastName' },
    //   {
    //     path: 'designations',
    //     select: 'division department position',
    //     populate: [{ path: 'department', select: 'name' }],
    //   },
    // ]);
    return res.status(200).json({
      status: true,
      messages,
    });

    return res.status(201).json({
      status: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error,
    });
  }
};

module.exports = {
  create,
  getRoomMessages,
};
