"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError");

const config = require("../../../config/config");
const Account = require("../model/account.model");
const RegisteredUser = require("../model/user.model");
const auth = require("../auth");
const register= require("./account.controller");  
// create a user profile
const createProfile = (req, res, next) => {
  const id = req.params.id;
  const registeredUser = new RegisteredUser({
    name: req.body.name,
    gender: req.body.gender,
    skillArea: req.body.skillArea,
    mobileNumber: req.body.mobileNumber,
    about: req.body.about,
    bio: req.body.bio,
    account: register
  })

  registeredUser
    .save()
    .then(result => res.send(result))
    .catch(e => console.log(e));
  // Account.findById(id, function (err, user) {
  //   if (err) {
  //     return res.status(500).send({
  //       message: err
  //     });
  //   } else {
      
  //   }
  // })
}

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
  const currentAccount = req.user;
  const id = (req.params.id);
  console.log(id);
  Account.findById(id, function (err, user) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    } else {
      res.json(user);
    }

  });
}

const profileUpdate = (req, res) => {
  const currentAccount = req.user;
  Account.findByIdAndUpdate(req.params.id, {
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
  Account.findByIdAndRemove(req.params.id, function (err) {
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