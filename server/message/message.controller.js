'use strict';

const Message = require('./message.model');

const { chatkit } = require('../services/pusher.services');

const create = async (req, res, next) => {
  const message = new Message({
    text: req.body.text,
    room: req.body.room,
    account: req.user.id,
  });

  try {
    await message.save();
    //need to send from here arif
    // await chatkit.sendSimpleMessage({
    //   userId: message.account,
    //   roomId: message.room,
    //   text: message.text,
    // });

    res.send(message);
  } catch (e) {

    next(e);
  }
};

const getUser = async (req, res) => {
  chatkit
    .getUser({
      id: req.query.id,
    })
    .then(user => {
      return res.status(200).send(user);
    })
    .catch(({ status, error_description }) => {
      return res.status(status).json({
        status: false,
        message: error_description,
      });
    });

  // const authData = chatkit.authenticate({
  //   userId: req.user._id + '1',
  // });

  // return res.status(authData.status).send(authData.body);
};

module.exports = {
  getUser,
  create,
};
