const User = require('../models/user');
const passport = require('passport');
const helpers = require('../utils/index');
const userController = require('./user.ctrl');

const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'http://localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : '//localhost:3001';

//= =======================================
// Social Auth Callback
//= =======================================

exports.socialAuthCallback = (req, res) => {
  console.log('################# social auth callback');
  if (req.user && req.user.err) {
    res.status(401).json({
      success: false,
      message: `social auth failed: ${req.user.err}`,
      error: req.user.err
    })
  } else {
    const userObj = req.user ? { ...req.user } :
      req.session && req.session.user ? { ...req.session.user } :
      undefined;
    if (userObj) {
      // successful authentication from provider
      console.log('successful social auth');
      // generate token
      // return user ID & social auth redirect flag as URL params
      const user = userObj._doc;
      const userInfo = helpers.setUserInfo(user);
      const token = helpers.generateToken(userInfo);
      return res.redirect(`${CLIENT_URL}/#/redirect=profile/${userObj._doc._id}/${token}`);

    } else {
      return res.redirect('/login');
    }
  }
};