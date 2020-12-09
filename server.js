'use strict';

// set up ======================================================================
const express = require('express');
const app = express();
const middleware = require('./middleware');
app.use(middleware);
const favicon = require('serve-favicon');
const dotenv = require('dotenv').load();
const path = require('path');

// initialize passport
const session = require('express-session');
const passport = require('passport');
require('./app/config/passport')(passport); // pass passport for configuration
const user = require('./app/utils/passport-serialize');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serialize);
passport.deserializeUser(user.deserialize);


// connect to db
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const configDB = require('./app/config/database.js');
mongoose.connect(configDB.url, configDB.options);
mongoose.Promise = global.Promise;

// set static path => uncomment this after client added
// app.use(express.static(path.join(__dirname, '/client/build/')));

// routes ======================================================================
const router = require('./router');
router(app);

app.get('/', (req, res) => {
  console.log('root route, serving client');
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
});

// launch ======================================================================
var port = process.env.PORT || 3001;
app.listen(port,  function () {
  console.log('Node.js listening on port ' + port + '...');
});