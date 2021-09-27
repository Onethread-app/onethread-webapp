const mongoose = require('mongoose');
const { Room } = require('./room.model');
const { Team } = require('../team-member/team.model');
const { Message } = require('../message/message.model');
const { UserMessage } = require('../message/userMessage.model');
const { RoomMember } = require('./roomMember.model');
const {
  addTeamMateIntoRoomNotification,
} = require('../notification/notification.controller');

const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const logger = require('../../config/winston');

const createRoom = async (company, project, account, name) => {
  const room = new Room({
    name /* roomName */,
    company /* companyId */,
    project /* projectId */,
    account /* userId */,
  });
  await room.save();
  logger.info(`Room Created Successfully.`);
  return room;
};

const createRoomMember = async (
  company,
  project,
  account,
  room,
  team,
) => {
  const roomMember = new RoomMember({
    account,
    team,
    company,
    project,
    room,
  });
  await roomMember.save();
  logger.info(`Room Member Added Successfully.`);
  return roomMember;
};

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

    const room = await createRoom(
      req.headers.companyid,
      req.query.pid,
      req.user._id,
      req.body.name,
    );

    const roomMember = await createRoomMember(
      req.headers.companyid,
      req.query.pid,
      req.user._id,
      room._id,
      req.team._id,
    );

    return sendJSONresponse(res, 201, { room, roomMember });
  } catch (e) {
    console.log(e);
    logger.error(`Room: ${e}`);
    next(e);
  }
};

const addMembers = async (req, res, next) => {
  try {
    const companyId = req.headers.companyid;
    const pid = req.query.pid;
    const roomId = req.body.room;
    const senderId = req.user._id;
    const roomMembers = req.body.members.map((member) => {
      return {
        account: member.account,
        team: member.team,
        company: companyId,
        project: pid,
        room: roomId,
      };
    });

    const result = await RoomMember.create(roomMembers);
    await addTeamMateIntoRoomNotification(
      companyId,
      senderId,
      roomMembers,
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
      roomId,
      pid,
    );

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

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const project = req.query.pid;

    const rooms = await RoomMember.find({
      account: req.user._id,
      project,
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
          populate: [{ path: 'company', select: '_id uniqueName' }],
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

    let modifiedRooms = [];

    await Promise.all(
      filterRooms.map(async (room) => {
        const memberCount = await RoomMember.find({
          room: room._id,
          project,
          removed: false,
        }).countDocuments();
        const modifiedRoom = { ...room, memberCount };
        modifiedRooms.push(modifiedRoom);
      }),
    );

    return res.status(200).json({
      rooms: modifiedRooms,
      roomsUnreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const chats = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const rooms = await RoomMember.find({
      account: req.user._id,
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
          populate: [
            {
              path: 'project',
              select: '_id name',
            },
            { path: 'company', select: '_id uniqueName' },
          ],
        },
      ]);

    const roomIds = rooms.map((room) => {
      return room.room._id;
    });

    const options = [
      {
        path: 'room',
        select: '_id name company project',
        populate: [
          {
            path: 'project',
            select: '_id name color',
          },
          {
            path: 'company',
            select: '_id uniqueName',
          },
        ],
      },
      {
        path: 'message',
        select: 'account text type createdAt',
        populate: [
          {
            path: 'account',
            select: '_id firstName lastName profileImage',
          },
        ],
      },
    ];

    let uMessage = await Promise.all(
      roomIds.map(async (roomId) => {
        let uMsg = await UserMessage.find({
          room: roomId,
          receiver: req.user._id,
          read: false,
        })
          .sort({ createdAt: -1 })
          .select('read seen message receiver room')
          .populate(options)
          .exec();
        return uMsg[0];
      }),
    );

    const filteredMessages = uMessage.filter(
      (msg) => msg !== undefined,
    );

    return sendJSONresponse(res, 200, {
      rooms: filteredMessages,
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
    console.log(req);
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
    console.log(error);
    next(error);
  }
};

module.exports = {
  create,
  chats,
  list,
  getRoom,
  addMembers,
  suggestMember,
  memberList,
  archiveRoom,
  updateLastSeen,
  createRoom,
  createRoomMember,
};
