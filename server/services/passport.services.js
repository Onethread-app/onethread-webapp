const passport = require('passport');
const LocalStrategy = require('passport-local');
const Account = require('../account/account.model');
const { sendJSONresponse } = require('../helpers/jsonResponse');

// Setup options of local strategy
const localOptions = {
  usernameField: 'email',
  passReqToCallback: true,
  failWithError: true,
  badRequestMessage: 'Please fill the form',
};

// Create local strategy
const localLogin = new LocalStrategy(
  localOptions,
  (req, email, password, done) => {
    Account.findOne({ email })
      .populate('jobExperience education skillArea', '_id name')
      .exec((err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          // return res.json(user);
          return done(null, false);
        }

        // compare passwords - is 'password' equal to user.password?
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            console.log(err);
            return done(null, false, { message: 'invalid password' });
          }

          return done(null, user);
        });
      });
  },
);

// Tell passport to use this strategy
passport.use(localLogin);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  delete user.password;
  done(null, user);
});
