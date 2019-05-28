const passport = require("passport");
const Account = require("../server/account/account.model");
const config = require("./config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
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

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.jwtSecret
};

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

passport.use(jwtLogin);
// passport.use(localLogin);
