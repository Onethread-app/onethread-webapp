const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const config = require('../../config/config');
const Account = require('../account/account.model');

// Setup options of local strategy
const localOptions = {
  usernameField: 'email',
};

// Create local strategy
const localLogin = new LocalStrategy(
  localOptions,
  (email, password, done) => {
    // Verify this email and password
    // Call done with the user if correct email:password
    // Otherwise call done with false
    Account.findOne({ email }, (err, account) => {
      if (err) {
        return done(err);
      }
      if (!account) {
        return done(null, false);
      }

      // compare passwords - is 'password' equal to user.password?
      account.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }

        return done(null, account);
      });
    });
  },
);

// Setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwtSecret,
};

// Create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in the payload exists in our database
  Account.findById(payload._id, (err, account) => {
    if (err) {
      return done(err, false);
    }
    // If it does, call 'done' with that user
    if (account) {
      done(null, account);
    } else {
      // otherwise, call 'done' without a user object
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
