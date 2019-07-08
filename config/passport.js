'use strict';

const passport = require("passport");
const config = require("./config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Account = require("../server/account/account.model");
const User = require("../server/registereduser/user.model");

// LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await Account.findOne({ email });

        // If not, handle it
        if (!user) {
          return done(null, false);
        }

        // check if password not matches
        user.comparePassword(password, function(err, isMatch) {
          if (!isMatch) {
            return done(null, false);
          }
        });

        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Facebook Login Strategy
passport.use(new FacebookStrategy({
  clientID      : config.facebookID,
  clientSecret  : config.facebookSecret,
  callbackURL   : process.env.BASE_URL + process.env.FACEBOOK_CALLBACK_PATH,
  profileFields : ['id', 'name', 'emails', 'displayName', 'picture.type(large)']
},(accessToken, refreshToken, profile, done) => {

  //console.log('Facebook profile:', JSON.stringify(profile, null, 2));

  const query = { platform : 'facebook', profileId : profile.id };

  const update = {
    platform    : 'facebook',
    profileId   : profile.id,
    email       : profile.emails ? profile.emails[0].value : undefined,
    displayName : profile.displayName,
    givenName   : profile.name.givenName,
    familyName  : profile.name.familyName,
    avatarUrl   : profile.photos ? profile.photos[0].value : undefined,
    lastLogin : {
      timestamp : new Date()
    }
  };

  const options = { upsert : true, new : true };

  User.findOneAndUpdate(query, update, options, (err, user) => err ? done(err) : done(null, user));
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

// Google Login
passport.use(new GoogleStrategy({
  clientID     : process.env.GOOGLE_CLIENT_ID,
  clientSecret : process.env.GOOGLE_CLIENT_SECRET,
  callbackURL  : process.env.BASE_URL + process.env.GOOGLE_CALLBACK_PATH
},
(accessToken, refreshToken, profile, done) => {

  //console.log('Google profile:', JSON.stringify(profile, null, 2));

  const query = { platform : 'google', profileId : profile.id };

  const update = {
    platform    : 'google',
    profileId   : profile.id,
    email       : profile.emails ? profile.emails[0].value : undefined,
    displayName : profile.displayName,
    givenName   : profile.name.givenName,
    familyName  : profile.name.familyName,
    avatarUrl   : profile.photos ? profile.photos[0].value : undefined,
    lastLogin : {
      timestamp : new Date()
    }
  };

  const options = { upsert : true, new : true };

  User.findOneAndUpdate(query, update, options, (err, user) => err ? done(err) : done(null, user));
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.jwtSecret
};
console.log(jwtOptions.jwtFromRequest);
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  Account.findById(payload._id, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Facebook Login




passport.use(jwtLogin);
<<<<<<< HEAD
// passport.use(localLogin);

=======
//passport.use(localLogin);
>>>>>>> remotes/origin/finalOrvi
