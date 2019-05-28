"use strict";
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

const config = require("../../config/config");
const Account = require("../account/account.model");
const RegisteredUser = require("./user.model");



// create a user profile
const createProfile = (req, res, next) => {

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
  })
  registeredUser
    .save()
    .then(result => {
      req.profile = result;
      res.status(201).send({
        success: true,
        result: result
      })

    }).catch(err => res.json(err))
}





// Account.findById(id, function (err, user) {
//   if (err) {
//     return res.status(500).send({
//       message: err
//     });
//   } else {

//   }
// })


const profileList = (req, res, next) => {
  const {
    limit = 50, skip = 0
  } = req.query;
  Account.find()
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
}
const profile = (req, res, next) => {
  let id = req.user.id;
  RegisteredUser.find({account: id})
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
}

const profileUpdate = (req, res) => {
  const currentAccount = req.user;
  RegisteredUser.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, function (err, user) {
    if (err) {
      return res.status().send({
        message: err
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "Profile update successful",
        user: user
      });
    }
  });
}

const profileDelete = (req, res) => {
  registeredUser.findByIdAndRemove(req.params.id, function (err) {
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
  })
}

module.exports = {
  profileList,
  profile,
  profileUpdate,
  profileDelete,
  createProfile
};