// Importing Passport, strategies, and config
const passport = require('passport'),
  User = require('../models/user'),
  Auth = require('../config/auth'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  GithubStrategy = require('passport-github2').Strategy;

module.exports = (passport) => {

  // Local strategy options
  const localOptions = {
    usernameField: 'email',
    passReqToCallback : true
  };

  // JWT strategy options
  const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Telling Passport where to find the secret
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback : true
  };

  // JWT login strategy
  passport.use('jwt', new JwtStrategy(jwtOptions,
    (req, payload, done) => {
      // console.log(payload);
      User.findById(payload._id, (err, user) => {
        if (err) { return done(err, false); }

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
  }));

  //= ========================
  // Social logins
  //= ========================

  // helper methods for updating existing profile with social login info

  const findExistingUser = (profile, token, done) => {
    console.log('findExistingUser');
    User.findOne({'github.id': profile.id})
    .exec()
    .then(user => {
      if (!user) {
        console.log('user not found, going to saveNewUser');
        return saveNewUser(profile, token, done);
      } else {
        return done(null, user);
      }
    })
    .catch( (err) => {
      console.log(err);
      return done(err);
    });
  }

  // save new user
  const saveNewUser = (profile, token, done) => {
    console.log('saveNewUser');
    console.log('#########################');
    console.log('github profile data structure');
    console.log(profile);
    const newUser = new User();
    newUser.github.id = profile.id;
    newUser.github.token = token;
    newUser.github.email = profile.emails ? profile.emails[0].value : "";
    newUser.github.userName = profile.username;
    newUser.profile.firstName = profile.displayName ? profile.displayName.split(' ')[0] : "",
    newUser.profile.lastName = profile.displayName ? profile.displayName.split(' ').slice(1) : "",
    newUser.profile.avatarUrl = profile.photos[0].value,

    // save new user to database
    newUser.save()
      .then((user) => {
        console.log(`saving new user to db`);
        return done(null, user);
      })
      .catch(err => {
        console.log(err);
        return done(err, null);
      });
  }

  // Github strategy options
  const githubOptions = {
    clientID: Auth.githubAuth.clientID,
    clientSecret: Auth.githubAuth.clientSecret,
    redirect_uri: Auth.githubAuth.callbackURL,
    profileFields: ['id', 'emails', 'name', 'username', 'photos'],
    passReqToCallback: true,
    scope: ['profile', 'email']
  };

  // Github login strategy
  passport.use('github', new GithubStrategy(githubOptions,
    function(req, token, refreshToken, profile, done) {
      console.log(`Github login by ${profile.displayName}, ID: ${profile.id}`);
      process.nextTick( () => {
        // console.log(req.user);
        // check if user is already logged in
        if (!req.user) {
          findExistingUser(profile, token, done)
        } else {
          // found logged-in user. Return
          console.log('gh found user');
          console.log(req.user);
          return done(null, req.user);
        }
      }); // process.nextTick()
    }) // GithubStrategy
  );

}
