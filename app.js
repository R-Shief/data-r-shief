// Add app
var express = require('express');
var app = express();

// Use express's built in json and url encoding middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Add logger
var logger = require('morgan');
app.use(logger('dev'));

// Add static path
app.use(express.static(path.join(__dirname, 'dist')));

if (app.get('env') === 'production') app.set('trust proxy', 1) // trust first proxy (for secure cookies)

var database = require('./database.js');
app.use(database.session);

// Routers =============================================================
var indexRouter = require('./routes/index');
var dashRouter = require('./routes/dashboard');

app.use('/', indexRouter);
app.use('/dashboard', dashRouter);

app.get('/bibViz', function(req, res, next) {
  res.render('bibViz');
});

app.get('/test', function(req, res, next) {
  res.render('test');
})

app.get('/headerNav', function(req, res, next) {
  res.render('header');
})



// Error Handlers ========================================================

var createError = require('http-errors');
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
