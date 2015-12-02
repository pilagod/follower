/**
 *  App Server
 */

/* Node Modules */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

/* DB */
var db = require('./db');

/* Routers */
var api_router = require('./routes/api/api_router');
var view_router = require('./routes/view/view_router');

/* Socket Server */
var SocketServerInstance = require('./socketServer');

/* APP */
var app = new express();
var http = require('http').Server(app);
var socketServer = new SocketServerInstance(http);

/* Socket Init */
socketServer.start();

app.set('port', process.env.PORT || 3000);

/*  Module Middleware */
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'FollowUpApp',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

/* Self Defined Middleware */
app.use(function (req, res, next) {
  req.socketServer = socketServer;
  next();
});

/*  Router Middleware */
app.use('/', view_router);
app.use('/api', api_router);

// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserializeUser");
  done(null, user);
});

http.listen(app.get('port'), function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", app.get('port'), app.get('port'));
  }
});
