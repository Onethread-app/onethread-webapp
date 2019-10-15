const Room = require('./room.model');
const serviceRoom = require('./room.service');
const { chatkit } = require('../services/pusher.services');
const mongoose = require('mongoose');

// const create = (req, res, next) => {
//   let listPromise = [];

//   const room = new Room({chatkit
//     name: req.body.name,
//     company: req.body.company,
//     members: [req.user.id],
//     account: req.user,
//   });

//   listPromise.push(room.save());

//   listPromise.push(serviceRoom.addRoom(room.id, room.name, req.user));
//   Promise.all(listPromise)
//     .then(result => res.json(result[0]))
//     .catch(e => next(e));
// };

const create = async (req, res, next) => {
  const room = new Room({
    name: req.body.name,
    company: req.body.company,
    members: [req.user.id],
    account: req.user.id,
  });
  let cat;

  try {
    await room.save();
    //will remove future
    await mongoose.model('Company').findByIdAndUpdate(
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
    });

    res.send(room);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

function remove(req, res, next) {}

function edit(req, res) {}

const list = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  
  Room.find({ company: mongoose.Types.ObjectId(req.params.company) })
    .sort({ created: 1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => res.json(result))
    .catch(e => next(e));
};

const listByWorkplace = (req, res) => {
  const { limit = 5, skip = 0, workplace = '' } = req.query;
  Workplace.find({ workplace: workplace, removed: false })
    .sort({ createdAt: 1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => res.json(result))
    .catch(e => next(e));
};

function read(req, res) {}

function invite(req, res) {}

module.exports = { create, list, listByWorkplace };
