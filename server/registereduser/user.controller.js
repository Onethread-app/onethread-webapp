"use strict";
// const mongoose = require("mongoose");
// const passport = require("passport");
// const httpStatus = require("http-status");
// const APIError = require("../helpers/APIError");

// const config = require("../../config/config");
// const Account = require("../account/account.model");
const RegisteredUser = require("./user.model");



// create a user profile
const createProfile = async (req, res) => {
  const registeredUser = new RegisteredUser({
    name: req.body.name,
    gender: req.body.gender,
    skillArea: req.body.skillArea,
    mobileNumber: req.body.mobileNumber,
    about: req.body.about,
    bio: req.body.bio,
    secondaryEmail: req.body.secondaryEmail,
    birthday: req.body.birthday,
    account: req.user.id,
  });
  registeredUser
    .save()
    .then(result => {
      req.profile = result;
      res.status(201).send({
        success: true,
        result: result
      });

    }).catch(err => res.json(err));
};

const profileList = async (req, res) => {
  const {
    limit = 50, skip = 0
  } = req.query;
  RegisteredUser.find()
    .sort({
      createdAt: -1
    })
    .skip(+skip)
    .limit(+limit)
    .exec(function (err, user) {
      if (err) {
        return res.status(422).send({
          message: err
        });
      } else {
        res.json(user);
      }
    });
};
const profile = (req, res) => {
  let id = req.user.id;
  RegisteredUser.find({
      account: id
    })
    .populate('account')
    .exec()
    .then(profile => {
      if (!profile) {
        return res.status(404).json({
          message: "Profile not found"
        });
      }
      res.status(200).json({
        profile: profile,
        success: true,
        msg: "profile create successful"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const profileUpdate = async (req, res, next) => {
  RegisteredUser.findById(req.params.id, function(err, user) {
    user.name = req.body.name;
    user.gender = req.body.gender;
    user.mobileNumber = req.body.mobileNumber;
    user.skillArea = req.body.skillArea;
    user.secondaryEmail = req.body.secondaryEmail;
    user.birthday = req.body.birthday;
    user.about = req.body.about;
    user.bio = req.body.bio;
    user.save(function(err, data) {
      if (err) {
        next(err);
      } else {
        if (data === null) {
          res.send(404, 'Not found');
        } else {
          res.send(data);
        }
    }
    });
});
  RegisteredUser.findByIdAndUpdate(req.params.id, {
      $set: req.body
    })
    .exec()
    .then(profile => {
      if (!profile) {
        return res.status(404).json({
          message: "Profile not found"
        });
      }
      res.status(200).json({
        profile: profile,
        success: true,
        msg: "profile update successful"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const profileDelete = (req, res) => {
  RegisteredUser.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return res.status().send({
        message: err
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "Profile Delete successful"
      });
    }
  });
};

module.exports = {
  profileList,
  profile,
  profileUpdate,
  profileDelete,
  createProfile
};