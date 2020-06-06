const mongoose = require('mongoose');
const { Room } = require('./room.model');
const { Team } = require('../team-member/team.model');
const { Message } = require('../message/message.model');
const { RoomMember } = require('./roomMember.model');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const logger = require('../../config/winston');

const create = async (req, res, next) => {
  try {
    // check room already exists with same company
    const duplicate = await Room.findOne({
      name: req.body.name,
      company: req.headers.companyid,
      project: req.query.pid,
    });
    if (duplicate) {
      return sendErrorResponse(res, 409, 'DuplicateRoomError', {
        message: `Room already exists`,
      });
    }
    const newRoom = new Room({
      name: req.body.name,
      company: req.headers.companyid,
      project: req.query.pid,
      // members: [req.user._id],
      account: req.user._id,
    });

    const room = await newRoom.save();

    const newRoomMember = new RoomMember({
      account: req.user._id,
      team: req.team._id,
      company: req.headers.companyid,
      project: req.query.pid,
      room: room._id,
    });

    const roomMember = await newRoomMember.save();

    return sendJSONresponse(res, 201, { room, roomMember });
  } catch (e) {
    logger.error(`Room: ${e}`);
    next(e);
  }
};

const addMembers = async (req, res, next) => {
  try {
    const roomMembers = req.body.members.map((member) => {
      return {
        account: member.account,
        team: member.team,
        company: req.headers.companyid,
        project: req.query.pid,
        room: req.body.room,
      };
    });

    const result = await RoomMember.create(roomMembers);

    if (!result) {
      return sendErrorResponse(res, 404, 'RoomNotFoundError', {
        message: 'No room found',
      });
    }
    return sendJSONresponse(res, 201, {
      message: 'new members added into room',
    });
  } catch (error) {
    logger.error(`Rooms: ${error}`);
    next(error);
  }
};

const memberList = async (req, res, next) => {
  try {
    const roomMembers = await RoomMember.find({
      room: req.params.roomId,
      removed: false,
    })
      .select('-_id account')
      .populate([
        {
          path: 'account',
          select: 'name firstName lastName email profileImage',
        },
      ]);

    const members = roomMembers.map((roomMember) => {
      return {
        ...roomMember.account._doc,
      };
    });
    return res.status(200).json({
      members,
    });
  } catch (error) {
    next(error);
  }
};

const suggestMember = async (req, res, next) => {
  const { pid, roomId } = req.query;
  try {
    const roomMembers = await RoomMember.find({
      room: roomId,
      removed: false,
    })
      .select('-_id account')
      .populate([
        {
          path: 'account',
          select: 'name firstName lastName email',
        },
      ]);

    let projectMembers = await Team.find({ project: pid })
      .select('_id account')
      .populate('account', '_id name firstName lastName email')
      .exec();

    const teamMembers = projectMembers.filter((pm) => {
      return !roomMembers.some((rm) => {
        return (
          rm.account._id.toString() === pm.account._id.toString()
        );
      });
    });

    const members = teamMembers.map((tm) => {
      return {
        ...tm.account._doc,
        teamId: tm._id,
      };
    });
    return sendJSONresponse(res, 200, { members });
  } catch (error) {
    logger.error(`Rooms: ${error}`);
    next(error);
  }
};

const getRoom = async (req, res, next) => {
  try {
    let room = await Room.findOne({
      _id: req.params.roomId,
      removed: false,
    })
      .select('-__v -members')
      .exec();
    if (!room) {
      return res.status(404).json({
        message: 'No room found.',
      });
    }
    return sendJSONresponse(res, 200, { room });
  } catch (error) {
    logger.error(`Room: ${error}`);
    next(error);
  }
};

const listCompany = async (req, res, next) => {
<<<<<<< HEAD
=======
  
  const { limit = 50, skip = 0 } = req.query;
  try {
    const rooms = await RoomMember.find({
      account: req.user._id,
      company: req.params.company,
      removed: false,
    })
      .skip(+skip)
      .limit(+limit)
      .select('-_id room lastSeen')
      .populate([
        {
          path: 'room',
          select:
            'archive removed _id name company project account createdAt updatedAt',
        },
      ]);

    // unread count
    const roomsUnreadCount = {};
    for (const e of rooms) {
      const results = await Message.aggregate([
        {
          $match: {
            removed: false,
            room: mongoose.Types.ObjectId(e.room._id),
            // room: {
            //   $in: roomObjectIDs,
            // },
            createdAt: {
              $gt: new Date(e.lastSeen),
            },
          },
        },
        {
          $group: {
            _id: '$room',
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      if (results.length > 0) {
        roomsUnreadCount[results[0]._id] = results[0].count;
      } else {
        roomsUnreadCount[e.room._id] = 0;
      }
    }

    const filterRooms = rooms.map(({ room }) => {
      return {
        ...room._doc,
      };
    });

    return res.status(200).json({
      rooms: filterRooms,
      roomsUnreadCount,
    });
  } catch (error) {
   
    next(error);
  }
};

const list = async (req, res, next) => {
>>>>>>> 0db3de3c... Feat/notification (#198)
  const { limit = 50, skip = 0 } = req.query;
  try {
    const rooms = await RoomMember.find({
      account: req.user._id,
      company: req.params.company,
      removed: false,
    })
      .skip(+skip)
      .limit(+limit)
      .select('-_id room lastSeen')
      .populate([
        {
          path: 'room',
          select:
            'archive removed _id name company project account createdAt updatedAt',
        },
      ]);

    // unread count
    const roomsUnreadCount = {};
    for (const e of rooms) {
      const results = await Message.aggregate([
        {
          $match: {
            removed: false,
            room: mongoose.Types.ObjectId(e.room._id),
            // room: {
            //   $in: roomObjectIDs,
            // },
            createdAt: {
              $gt: new Date(e.lastSeen),
            },
          },
        },
        {
          $group: {
            _id: '$room',
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      if (results.length > 0) {
        roomsUnreadCount[results[0]._id] = results[0].count;
      } else {
        roomsUnreadCount[e.room._id] = 0;
      }
    }

    const filterRooms = rooms.map(({ room }) => {
      return {
        ...room._doc,
      };
    });

    return res.status(200).json({
      rooms: filterRooms,
      roomsUnreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const rooms = await RoomMember.find({
      account: req.user._id,
      company: req.headers.companyid,
      project: req.query.pid,
      removed: false,
    })
      .skip(+skip)
      .limit(+limit)
      .select('-_id room lastSeen')
      .populate([
        {
          path: 'room',
          select:
            'archive removed _id name company project account createdAt updatedAt',
        },
      ]);

    // unread count
    const roomsUnreadCount = {};
    for (const e of rooms) {
      const results = await Message.aggregate([
        {
          $match: {
            removed: false,
            room: mongoose.Types.ObjectId(e.room._id),
            // room: {
            //   $in: roomObjectIDs,
            // },
            createdAt: {
              $gt: new Date(e.lastSeen),
            },
          },
        },
        {
          $group: {
            _id: '$room',
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      if (results.length > 0) {
        roomsUnreadCount[results[0]._id] = results[0].count;
      } else {
        roomsUnreadCount[e.room._id] = 0;
      }
    }

    const filterRooms = rooms.map(({ room }) => {
      return {
        ...room._doc,
      };
    });
    return sendJSONresponse(res, 200, {
      rooms: filterRooms,
      roomsUnreadCount,
    });
  } catch (error) {
    logger.error(`Room: ${error}`);
    next(error);
  }
};

const archiveRoom = async (req, res, next) => {
  try {
    const room = await Room.findOneAndUpdate(
      {
        _id: req.params.roomId,
      },
      {
        archive: req.body.archive,
      },
    );

    if (!room) {
      return res.status(404).json({
        message: 'No room found',
      });
    }

    return res.status(200).json({
      message: `Room ${req.body.archive ? 'archived' : 'activated'}.`,
    });
  } catch (error) {
    next(error);
  }
};

const updateLastSeen = async (req, res, next) => {
  try {
    const room = await RoomMember.findOneAndUpdate(
      {
        room: req.params.roomId,
        account: req.user._id,
      },
      {
        lastSeen: new Date(),
      },
    );

    if (!room) {
      return res.status(404).json({
        message: 'No room found',
      });
    }

    return res.status(200).json({
      message: 'Last seen updated',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
  listCompany,
  getRoom,
  addMembers,
  suggestMember,
  memberList,
  archiveRoom,
  updateLastSeen,
};
