"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError");

const config = require("../../../config/config");
const User = require("../model/account.model");
const auth = require("../auth");

// create a user profile
const createProfile = (req, res, next) => {
 res.json('I am triggered');
}

const profileList = (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  User.find()
    .sort({ createdAt: -1 })
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
  const currentUser = req.user;
  const id = (req.params.id);
  console.log(id);
  User.findById(id, function (err, user) {
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
  const currentUser = req.user;
  User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
    if (err){
      return res.status().send({
        message: err
      });
    } else{
      res.status(201).send({
        success: true,
        msg: "Profile update successful",
        user: user
      });
    }
});
}

const profileDelete = (req, res) => {
  User.findByIdAndRemove(req.params.id, function(err){
    if (err){
      return res.status().send({
        message: err
      });
    }else{
      res.status(201).send({
        success: true,
        msg: "Profile Delete successful"
      });
    }
  })

}
module.exports = { profileList, profile, profileUpdate, profileDelete , createProfile};
