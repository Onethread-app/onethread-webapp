"use strict";
const Account = require("../account/account.model");
//const RegisteredUser = require("../model/user.model");
const CompanyUser = require("../company/company.model");

// create a user profile
const createProfile = async(req, res) => {
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
    account: req.user.id
  });
  companyUser
    .save()
    .then(result => {
      req.profile = result;
      res.status(201).send({
        success: true,
        result: result
      });
    })
    .catch(err => res.json(err));
};



const profileList = (req, res) => {
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
};
const profile = (req, res) => {
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
        msg: "Company profile found"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const profileUpdate = (req, res) => {
  //const currentAccount = req.user;
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
};

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
  });

};
module.exports = {
  profileList,
  profile,
  profileUpdate,
  profileDelete,
  createProfile
};