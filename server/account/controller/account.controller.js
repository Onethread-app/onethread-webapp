"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError");

const config = require("../../../config/config");
const User = require("../account.model");

const sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

const register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, msg: "Please pass username and password." });
  } else {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
 
    });

    user
      .save()
      .then(result => {
        // console.log(result);
        let token;
        token = user.generateJwt();
        res.status(201).json({
          message: "Handling POST requests to apis/users",
          createdUser: {
            _id: result._id,
            email: result.email,
            role: result.role,
            token: token
          }
        });
      })
      .catch(err => {
        // console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
};

const roleAuthorization = (roles)=>{

    return function(req, res, next){
        console.log(user._id);

        User.findById(user._id, function(err, foundUser){
            let role = foundUser.role;
            console.log(role);
            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');

        });

    }

}
/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login =  (req, res) => {
  

            let token = req.user.generateJwt();
            // return the information including token as JSON
            res.json({ success: true, token: token });
       
};

// const logout = (req, res, next) => {
//   User.remove({ _id: req.params.id })
//     .exec()
//     .then(res => {
//       res.status(201).json({
//         success: true,
//         message: "user deleted"
//       })
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       })
//     });

// }

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
module.exports = { sendJSONresponse, register, login, profileList, profile, profileUpdate, profileDelete , roleAuthorization};
