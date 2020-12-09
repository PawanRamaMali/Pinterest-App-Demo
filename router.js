const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'localhost:3000';

const AuthController = require('./app/controllers/auth.ctrl');
const UserController = require('./app/controllers/user.ctrl');
const StaticController = require('./app/controllers/static.ctrl');
const PinController = require('./app/controllers/pin.ctrl');

const express = require('express');
const passport = require('passport');
const Auth = require('./app/config/auth');
const helpers = require('./app/utils/index');

/* =========================== ROUTE MIDDLEWARE ============================ */

const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      console.log('requireAuth');
      if (err) {
        console.log(`router.js > 22: ${err}`);
        return res.status(422).send({ success : false, message : err.message });
      }
      if (!user) {
        return res.status(422).send({ success : false, message : 'Sorry, you must log in to view this page.' });
      }
      if (user) {
        console.log(`router.js > 29: user found`);
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.log(`router.js > 32: ${loginErr}`);
            return next(loginErr);
          } else {
            console.log(`router.js > 35: returning next`);
            return next(loginErr, user);
          }
        }); // req.login
      }
    })(req, res, next);
  };

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    pinRoutes = express.Router();
    // tradeRoutes = express.Router();

  // app.use(passport.initialize());
  // app.use(passport.session());

// ============================================================================
// AUTHENTICATE ===============================================================
// ============================================================================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Github authentication with passport
  authRoutes.get('/github',
    passport.authenticate('github', {scope : ['profile', 'email']} ));


  // Handle callback after Github auth
  // return user object and token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/github/callback',
    passport.authenticate('github'), AuthController.socialAuthCallback
    );

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View full user profile route (secured)
  // Returns fail status + message -or- user object
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

  // Get partial user profile route (unsecured)
  // Returns fail status + message -or- first name, avatar, city, and state
  userRoutes.get('/partial/:userId', UserController.partialProfile);

  // Update a user's profile. (secured)
  // Returns fail status + message -or- updated user object
  userRoutes.put('/:userId', requireAuth, UserController.updateProfile);


  //= ========================
  // Pin Routes
  //= ========================

  // Set pin routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/pin', pinRoutes);

  // Get all pins (unsecured)
  // Returns fail status + message -or- array of all pins
  pinRoutes.get('/allpins', PinController.getAllPins);

  // Get a single pin by Id (unsecured)
  // Returns fail status + message -or- pin object
  pinRoutes.get('/:pinId', PinController.getPinById);

  // Get all pins for one user (unsecured)
  // Returns fail status + message -or- array of user's pins
  pinRoutes.get('/userpins/:userId', PinController.getUserPins);

  // Search image (unsecured)
  // Returns fail status + message -or- array of images from google images api
  pinRoutes.get('/search/:keyword', PinController.searchImage);

  // Add new pin (secured)
  // Returns fail status + message -or- pin object
  pinRoutes.put('/new', requireAuth, PinController.addPin);

  // Remove pin (secured)
  // Returns fail status + message -or- pin object
  pinRoutes.put('/remove/:pinId', requireAuth, PinController.removePin);


  // Set url for API group routes
  app.use('/api', apiRoutes);

  // Catch client-side routes that don't exist on the back-end.
  // Redirects to /#/redirect={route}/{optional_id}
  app.get('/:client_route/:id?', StaticController.redirectHash);

};