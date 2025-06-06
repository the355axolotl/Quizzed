var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db'); 
require("dotenv").config();

var indexRouter = require('./routes/index');
var questionsRouter = require('./routes/questions');
var signupRouter = require('./routes/signup');
var signinRouter = require('./routes/signin');

var session = require('express-session');
const { sign } = require('crypto');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'quizzed-app-secret', 
  resave: false, // Doesn't save the session if unmodified
  saveUninitialized: true // Doesn't save the session unless something is stored 
}))

// Routes
app.use('/signup',signupRouter);
app.use('/play', questionsRouter);
app.use('/', indexRouter);
app.use('/signin',signinRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
