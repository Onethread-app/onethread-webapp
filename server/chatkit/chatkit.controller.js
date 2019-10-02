'use strict';

const { chatkit } = require('../services/pusher.services');

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
};
