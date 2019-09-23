const Room = require('./room.model');
const chatkitService = require('../services/pusher.services');

const create = (req, res, next, id) => {
  const room = new Room({
    name: req.body.name,
    members: [req.user.id],
  });

  room
    .save()
    .then(result => {
      chatkitService
        .createRoom({
          id: result._id,
          creatorId: req.user._id,
          name: result.name,
          customData: { foo: 42 },
        })
        .then(() => {
          return result;
        });
    })
    .then(result => res.send(result))
    .catch(e => next(e));
};

function remove(req, res, next) {}

function edit(req, res) {}

const list = (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  Room.find({ members: req.user._id })
    .sort({ updated: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => res.json(result))
    .catch(e => next(e));
};

function read(req, res) {}

function invite(req, res) {}

module.exports = { create, list };
