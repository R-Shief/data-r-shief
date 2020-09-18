var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var database = require('./database.js');

var indexRouter = require('./routes/index');
var dashRouter = require('./routes/dashboard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  database.sessionConf.cookie.secure = true // serve secure cookies
}
app.use(database.session(database.sessionConf));

app.use('/', indexRouter);
app.use('/dashboard', dashRouter);

app.get('/bibViz', function(req, res, next) {
  res.render('bibViz');
});

app.get('/test', function(req, res, next) {
  res.render('test');
})

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
