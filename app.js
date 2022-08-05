var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import bcrypt from 'bcrypt';
import alert from 'alert';

import sqlite3 from 'sqlite3';
import { open } from "sqlite";

const SALT_ROUNDS = 10;

//Initialize DB
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

var app = express();

// view engine setup
app.engine('.html', require('ejs').__express);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//define and import all routes
app.use(require('./routes/index'));
app.use(require('./routes/apptlist'));
app.use(require('./routes/apptmod'));
app.use(require('./routes/login'));
app.use(require('./routes/modifyappt'));
app.use(require('./routes/newappt'));
app.use(require('./routes/recreq'));
app.use(require('./routes/register'));

const setup = async () => {
  const db = await dbPromise;
  await db.migrate();
};
setup();

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