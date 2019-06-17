"use strict";
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

const config = require("../../config/config");
const Account = require("../account/account.model");
//const RegisteredUser = require("../model/user.model");
const CompanyUser = require("../company/company.model");

// create a user profile
const createProfile = (req, res, next) => {
  const companyUser = new CompanyUser({
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber,
    companyAddress: req.body.companyAddress,
    establishDate: req.body.establishDate,
    selectDistrict: req.body.selectDistrict,
    selectThana: req.body.selectThana,
    businessDescription: req.body.businessDescription,
    tradeLicense: req.body.tradeLicense,
    contactPersonName: req.body.contactPersonName,
    contactPersonDesignation: req.body.contactPersonDesignation,
    contactPersonEmail: req.body.contactPersonEmail,
    contactPersonMobile: req.body.contactPersonMobile,
    //category: id,
    account: id
  })
  companyUser
    .save()
    .then(result => {
      res.redirect(`http://127.0.0.1:4040/api/v1/account/profile/${result._id}`);
    })
    .catch(err => res.json(err))
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
  CompanyUser.findById(id)
    .populate('account')
    .exec()
    .then(profile => {
      if (!profile) {
        return res.status(404).json({
          message: "Company profile not found"
        });
      }
      res.status(200).json({
        profile: profile,
        success: true,
        msg: "Company profile create successful"
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
  CompanyUser.findByIdAndUpdate(req.params.id, {
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
  CompanyUser.findByIdAndRemove(req.params.id, function (err) {
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