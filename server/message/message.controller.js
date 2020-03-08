const { Message } = require('./message.model');
const { Room } = require('./../room/room.model');
const Account = require('./../account/account.model');
const { chatkit } = require('../services/pusher.services');
const File = require('./../file/file.model');

const create = async (req, res, next) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }

  try {
    const room = await Room.findById(req.body.room);
    if (!room) {
      return res.status(404).json({
        message: `No room exists`,
      });
    }

    let files = req.body.files.map(file => file._id);

    const message = new Message({
      text: req.body.text,
      room: req.body.room,
      type: req.body.type,
      files,
      account: req.user._id,
    });

    const account = await Account.findById(req.user._id)
      .select('name firstName lastName email')
      .populate({
        path: 'profileImage',
        select: '-_id link',
      });

    //send to chatkit-server
    let msg = await chatkit.sendMultipartMessage({
      userId: message.account,
      roomId: message.room,
      parts: [
        {
          type: 'text/plain',
          content: JSON.stringify({
            message,
            account,
            files: req.body.files,
          }),
        },
      ],
    });

    // save ref of chatkit
    if (msg) {
      message.chatkitId = msg.message_id;
    }

    await message.save();

    await File.updateMany(
      { _id: { $in: files } },
      {
        message: message._id,
        room: message.room,
      },
    );

    return res.status(201).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomMessages = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({
        message: `No room exists`,
      });
    }

    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({
      room: req.params.roomId,
      removed: false,
    })
      .select('-__v')
      .populate('files', '')
      .populate([
        {
          path: 'account',
          select: 'name firstName lastName email profileImage',
          populate: {
            path: 'profileImage',
            select: '-_id link',
          },
        },
        {
          path: 'files',
          select: 'link s3Key type',
        },
      ])
      .sort({ createdAt: 1 })
      .skip(+skip)
      .limit(+limit);

    return res.status(200).json({
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getRoomMessages,
};
