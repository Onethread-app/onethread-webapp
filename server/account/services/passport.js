const passport = require('passport');
const Account = require('../model/account.model');
const config = require('../../../config/config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const localOptions = {
    usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, function(email, password, done){

    Account.findOne({
        email: email
    }, function(err, user){

        if(err){
            return done(err);
        }

        if(!user){
            return done(null, false, {error: 'Login failed. Please try again.'});
        }

        user.comparePassword(password, function(err, isMatch){

            if(err){
                return done(err);
            }

            if(!isMatch){
                return done(null, false, {error: 'Login failed. Please try again.'});
            }

            return done(null, user);

        });

    });

});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwtSecret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

    Account.findById(payload._id, function(err, user){

        if(err){
            return done(err, false);
        }

        if(user){
            done(null, user);
        } else {
            done(null, false);
        }

    });

});

passport.use(jwtLogin);
passport.use(localLogin);