'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const User = require('./user.model');
const config = require('../../../config/config');
require('../../../config/passport')(passport);
const auth = require('../auth');

const sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

const register = (req, res) => { 
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
} 

else{
  const user = new User({
    name: req.body.name,
    gender: req.body.gender,
    skillArea: req.body.skillArea,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
    bio: req.body.bio
    });
    // we should write .then() function here during refactoring
    user.save(function(err) {
      let token;
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
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
const login = (req, res, next) => {
  User.findOne({
    username: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          let token = jwt.sign({username: user.username}, config.jwtSecret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
  
  };  

module.exports = { sendJSONresponse, register, login};
