const passport = require("passport");
const Account = require("../server/account/account.model");
const config = require("./config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
  profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    Account.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        Account.findById(req.account.id, (err, account) => {
          if (err) { return done(err); }
          account.facebook = profile.id;
          account.tokens.push({ kind: 'facebook', accessToken });
          account.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
          account.profile.gender = user.profile.gender || profile._json.gender;
          account.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
          account.save((err) => {
            req.flash('info', { msg: 'Facebook account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    Account.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      Account.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
          done(err);
        } else {
          const account = new Account();
          account.email = profile._json.email;
          account.facebook = profile.id;
          account.tokens.push({ kind: 'facebook', accessToken });
          account.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
          account.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          account.profile.location = (profile._json.location) ? profile._json.location.name : '';
          account.save((err) => {
            done(err, account);
          });
        }
      });
    });
  }
}));


passport.use(jwtLogin);
// passport.use(localLogin);

