'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Account = require('../account/account.model');
const { Message } = require('./message.model');
const errorHandler = require('../helpers/mongooseErrorFormat');
let fcm = require('./fcm');

// add message
const addMessage = async (req, res) => {
  // Check for JSON
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  const newMessage = new Message({
    text: req.body.text,
    account: req.user._id
  });

  console.log('server');
  newMessage
    .save()
    .then(async result => {
      let response = {
        message: 'New message created',
        newMessage: {
          id: result.id,
          text: result.text,
          createdAt: result.createdAt,
          account: {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName
          }
        }
      };
      await fcm.index(response.newMessage);
      return res.status(201).json(response);
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });
};

// get all messages
const getAllMessages = async (req, res) => {
  Message.find({})
    .sort('-createdAt')
    .populate('account', '_id email contactNo firstName lastName role')
    .exec()
    .then(result => {
      if (result) {
        let response = result.map(msg => {
          return {
            id: msg.id,
            text: msg.text,
            createdAt: msg.createdAt,
            account: {
              id: msg.account.id,
              email: msg.account.email,
              firstName: msg.account.firstName,
              lastName: msg.account.lastName
            }
          };
        });
        return res.status(200).json({
          messages: response
        });
      } else {
        return res.status(404).json({ message: 'No messages found' });
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

// get current account's messages
const getCurrentAccountMessages = async (req, res) => {
  Message.find({ account: req.user._id })
    .populate('account', '_id email contactNo firstName lastName role')
    .exec()
    .then(result => {
      if (result) {
        let response = result.map(msg => {
          return {
            id: msg.id,
            text: msg.text,
            createdAt: msg.createdAt,
            account: {
              id: msg.account.id,
              email: msg.account.email,
              firstName: msg.account.firstName,
              lastName: msg.account.lastName
            }
          };
        });
        return res.status(200).json({
          messages: response
        });
      } else {
        return res.status(404).json({ message: 'No messages found' });
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

module.exports = {
  addMessage,
  getAllMessages,
  getCurrentAccountMessages
};
