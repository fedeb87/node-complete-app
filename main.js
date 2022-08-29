'use strict';

const express = require( 'express' ),
  layouts = require( 'express-ejs-layouts' ),
  app = express(),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  expressSession = require("express-session"), //
  passport = require("passport"),

  router = require("./routes/indexRoutes"),
  User = require("./models/user"),
  mongoose = require( 'mongoose' ),
  methodOverride = require( 'method-override' );
  
if (process.env.NODE_ENV === "test") 
  mongoose.connect('mongodb://localhost/confetti_cuisine_test');
else 
  mongoose.connect( 'mongodb://localhost/confetti_cuisine' );


if (process.env.NODE_ENV === "test")
  app.set( 'port', 3001);
else 
  app.set( 'port', process.env.PORT || 3000 );

app.set( 'view engine', 'ejs' );

app.use( layouts );
app.use( express.static( 'public' ) );

// allows read body and query from request
app.use(
  express.urlencoded({
      extended: false
  })
);
app.use(express.json());

// sessions and cookies settings
app.use(cookieParser("super_secret_passcode")); // cookies-parser like middleware
// set express-sessions to use cookie-parser
app.use(expressSession({
  secret: "super_secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));

// passport library for auth and login users
app.use(passport.initialize());
app.use(passport.session());
// 
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());
app.use(expressValidator());

// add flash message to flashMessages variable
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use( methodOverride( '_method', {
  methods: [ 'POST', 'GET' ]
} ) );
app.use("/", router);

const server = app.listen( app.get( 'port' ), () => {
  console.log( `Server running at http://localhost:${app.get('port')}` );
} ),
io = require("socket.io")(server);
require("./controllers/chatsController")(io);

// grant access from test files
module.exports = app;