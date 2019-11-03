const Room = require('./room.model');
const { Company } = require('../company/company.model');
const serviceRoom = require('./room.service');
const { chatkit } = require('../services/pusher.services');
const mongoose = require('mongoose');

const create = async (req, res, next) => {
  const room = new Room({
    name: req.body.name,
    company: req.body.company,
    members: [req.user.id],
    account: req.user.id,
  });

  try {
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
          result,
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
  Room.find({ company: mongoose.Types.ObjectId(req.params.company) })
    .sort({ created: 1 })
    .skip(+skip)
    .limit(+limit)
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

const roomMemberSearch = async (req, res, next) => {
  // const name = req.query.name;
  // const cid = req.body.company;
  // const room = req.body.room;
  // let options = [
  //   {
  //     path: 'members',
  //     select: '_id account',
  //     populate: {
  //       path: 'account',
  //       select: 'name email',
  //     },
  //   },
  //   {
  //     path: 'rooms',
  //     select: 'members',
  //     populate: {
  //       path: 'members',
  //       select: 'name',
  //     },
  //   },
  // ];
  // const roomMemberList = await Company.findById({
  //   _id: cid,
  // }).populate(options);
  // return res.send(roomMemberList);
  // const roomMemberListId = [roomMemberList.members.account];
  // const roomMemberListId = [companyMemberList.account.name];
  // if (name === '') {
  //   const err = new BadRequestError(
  //     'Nothing Submitted',
  //     httpStatus.BAD_REQUEST,
  //     true,
  //   );
  //   logger.error(`Query Error: ${err}`);
  //   return next(err);
  // }
  // Company.find({ name: { $regex: name, $nin: memberListId } })
  //   .select('_id email name')
  //   .then(data => {
  //     if (data.length < 1) {
  //       const err = new SearchNotMatchError(
  //         'Query does not found',
  //         httpStatus.BAD_REQUEST,
  //         true,
  //       );
  //       logger.error(`Query Error: ${err}`);
  //       return next(err);
  //     } else {
  //       logger.info(`Search complete ${name}`);
  //       return sendJSONresponse(res, 200, {
  //         employees: {
  //           success: true,
  //           message: `Search complete ${name}`,
  //           data,
  //         },
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     return next(err);
  //   });
};

module.exports = { create, list, listByWorkplace, roomMemberSearch };
