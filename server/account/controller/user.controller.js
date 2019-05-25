"use strict";
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError");

const config = require("../../../config/config");
const Account = require("../model/account.model");
const RegisteredUser = require("../model/user.model");
const auth = require("../auth");

// create a user profile
const createProfile = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);

  
  Account.findById(id, function(err, user){
    if(err){console.log(err);}
    else{
      const registeredUser = new RegisteredUser({
        name: req.body.name,
        gender: req.body.gender,
        skillArea: req.body.skillArea,
        mobileNumber: req.body.mobileNumber,
        about: req.body.about,
        bio: req.body.bio,
        account: id,
      })
      registeredUser
      .save()
      .then(result => {
        res.redirect(`http://127.0.0.1:4040/api/v1/account/profile/${result._id}`);
      })
      .catch(err => res.json(err))
    }
  })


  
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
  let id = req.params.id;
  RegisteredUser.findById(id)
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