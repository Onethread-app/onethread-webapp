const { Room } = require('./room.model');
const { Team } = require('../team-member/team.model');
const { chatkit } = require('../services/pusher.services');
const logger = require('../../config/winston');
const _ = require('lodash');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const create = async (req, res, next) => {
  try {
    // check room already exists with same company
    const duplicate = await Room.findOne({
      name: req.body.name,
      company: req.body.company,
      project: req.body.project,
    });
    if (duplicate) {
      return sendErrorResponse(res, 409, 'DuplicateRoomError', {
        message: `Room already exists`,
      });
    }
    const room = new Room({
      name: req.body.name,
      company: req.body.company,
      project: req.body.project,
      members: [req.user._id],
      account: req.user._id,
    });
    await room.save();

    await chatkit.createRoom({
      id: room._id,
      creatorId: req.user._id,
      name: room.name,
      isPrivate: true,
      customData: {
        company: req.body.company,
        project: req.body.project,
      },
    });
    return sendJSONresponse(res, 201, { room });
  } catch (e) {
    next(e);
  }
};

const addMembers = async (req, res) => {
  Room.updateOne(
    { _id: req.body.room },
    {
      $addToSet: {
        members: { $each: req.body.members },
      },
    },
  )
    .exec()
    .then(result => {
      if (result) {
        chatkit
          .addUsersToRoom({
            roomId: req.body.room,
            userIds: req.body.members,
          })
          .then(() =>
            res.status(201).json({
              message: 'new members added into room',
            }),
          )
          .catch(err => res.status(500).json({ error: err }));
      } else {
        res.status(404).json({ message: 'No room found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

const memberList = async (req, res, next) => {
  Room.findById(req.params.roomId)
    .populate([
      {
        path: 'members',
        select: 'name firstName lastName email profileImage',
      },
    ])
    .exec()
    .then(({ members }) => res.json({ members: members }))
    .catch(e => next(e));
};

const suggestMember = async (req, res, next) => {
  const { projectId, roomId } = req.query;
  try {
    let roomMembers = await Room.findById(roomId)
      .select('-_id members')
      .populate('members', '_id name')
      .exec();

    let projectMembers = await Team.find({ project: projectId })
      .select('-_id account')
      .populate('account', '_id name firstName lastName email')
      .exec();

    let members = projectMembers.filter(pm => {
      return !roomMembers.members.some(rm => {
        return rm._id.toString() === pm.account._id.toString();
      });
    });

    members = members.map(m => m.account);

    return res.status(200).json({
      members,
    });
  } catch (error) {
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
    return res.status(200).json({
      room,
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  Room.find({
    members: req.user._id,
    company: req.params.company,
    project: req.params.project,
    removed: false,
  })
    .sort({ created: 1 })
    .skip(+skip)
    .limit(+limit)
    .select('-__v -members')
    .exec()
    .then(rooms =>
      res.status(200).json({
        rooms,
      }),
    )
    .catch(e => next(e));
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

const recheckMembersWithChatkit = async (req, res) => {
  let rooms = await Room.find({
    company: req.body.company,
    removed: false,
  });

  if (!rooms) {
    return res.status(400).json({
      message: 'No rooms found',
    });
  }

  logger.info(`Company : ${req.body.company}`);

  rooms.forEach(room => {
    let chunkMembers = _.chunk(room.members, 10);
    chunkMembers.forEach(members => {
      chatkit
        .addUsersToRoom({
          roomId: room._id,
          userIds: members,
        })
        .then(() =>
          logger.info(
            `${members.length} Chunk members added in Room: ${room.name}`,
          ),
        )
        .catch(err =>
          logger.error(
            `Failed to add members in chatkit for ${members.length} Chunk members while added in Room: ${room.name}`,
          ),
        );
    });
  });

  return res.status(200).json({
    rooms,
  });
};

module.exports = {
  create,
  list,
  getRoom,
  addMembers,
  suggestMember,
  memberList,
  recheckMembersWithChatkit,
  archiveRoom,
};
