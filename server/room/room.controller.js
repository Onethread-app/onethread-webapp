const { Room } = require('./room.model');
const { Member } = require('../company/member/member.model');
const { Company } = require('../company/company.model');
const { chatkit } = require('../services/pusher.services');
const mongoose = require('mongoose');

const create = async (req, res, next) => {
  try {
    // check room already exists with same company
    const duplicate = await Room.findOne({
      name: req.body.name,
      company: req.body.company,
    });
    if (duplicate) {
      return res.status(409).json({
        status: false,
        message: `Room already exists`,
      });
    }
    const room = new Room({
      name: req.body.name,
      company: req.body.company,
      members: [req.user.id],
      account: req.user.id,
    });
    await room.save();
    //will remove future
    await Company.findByIdAndUpdate(
      req.body.company,
      {
        $addToSet: {
          rooms: { $each: [room._id] },
        },
      },
      { new: true },
    );

    await chatkit.createRoom({
      id: room._id,
      creatorId: req.user._id,
      name: room.name,
      isPrivate: true,
      customData: {
        company: req.body.company,
      },
    });

    return res.status(201).json({
      room,
    });
  } catch (e) {
    next(e);
  }
};

const addUsers = async (req, res) => {
  Room.updateOne(
    { _id: req.body.room },
    {
      $addToSet: {
        members: { $each: req.body.members },
      },
    },
  )
    .exec()
    .then(async result => {
      if (result) {
        await chatkit.addUsersToRoom({
          roomId: req.body.room,
          userIds: req.body.members,
        });
        res.status(201).json({
          message: 'new members added into room',
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: 'No room found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

const memberList = async (req, res) => {
  Room.findById(req.params.roomId)
    .populate('members', 'name')
    .exec()
    .then(({ members }) => res.json({ members: members }))
    .catch(e => next(e));
};

const suggestMember = async (req, res, next) => {
  //req.params.roomId empty check require
  try {
    let roomMembers = await Room.findById(req.params.roomId)
      .select('-_id members')
      .populate('members', '_id name')
      .exec();

    let companyMembers = await Member.find({
      company: req.params.companyId,
    })
      .select('-_id account')
      .populate('account', '_id name')
      .exec();

    let members = companyMembers.filter(({ account }) => {
      return !roomMembers.members.some(existingMember => {
        return (
          existingMember._id.toString() === account._id.toString()
        );
      });
    });
    // TODO: it will execute in client
    // members empty check
    members = members.map(m => m.account);

    return res.status(200).json({
      members,
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;

  Room.find({ company: req.params.company, removed: false })
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

module.exports = {
  create,
  list,
  addUsers,
  suggestMember,
  memberList,
};
