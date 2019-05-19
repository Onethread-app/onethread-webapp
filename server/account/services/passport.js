const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Accounts = require('../model/user.model');

const config = require('../../../config/config'); // get db config file

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.jwtSecret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Accounts.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};
