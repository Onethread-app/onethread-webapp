const passport = require("passport");
const LocalStrategy = require("passport-local");
const Account = require("../account/account.model");
const { sendJSONresponse } = require("../helpers/jsonResponse");
const logger = require("../../config/winston");

// Setup options of local strategy
const localOptions = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
  failWithError: true,
  badRequestMessage: "Please fill the form",
};

// Create local strategy
const localLogin = new LocalStrategy(
  localOptions,
  async (req, email, password, done) => {
    try {
      const user = await Account.findOne({
        email,
        isAccountVerified: true,
      }).populate("jobExperience education skillArea", "_id name");
      if (!user) {
        logger.error(`No user found!`);
        return done(null, false, {
          message: "invalid email or password",
        });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        logger.error(`Password is not matching!`);
        return done(null, false, {
          message: "invalid email or password",
        });
      }
      return done(null, user);
    } catch (err) {
      logger.error(`Account: ${err}`);
      return done(err);
    }
  }
);

// Tell passport to use this strategy
passport.use(localLogin);

passport.serializeUser(function (user, done) {
  delete user.password;
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// const requireLogin =
