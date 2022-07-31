var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import bcrypt from 'bcrypt';

import sqlite3 from 'sqlite3';
import { open } from "sqlite";

const SALT_ROUNDS = 10;

//Initialize DB
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

var indexRouter = require('./routes/index');

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

app.use('/', indexRouter);

app.get("/register", async (req, res) => {
  res.render("register");
});
app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { username, password, passwordRepeat } = req.body;

  if (password !== passwordRepeat) {
    res.render("register", { error: "Passwords must match" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, passwordHash);
 
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const dbUser = await db.all('SELECT password FROM users where username = ?', username);

  await bcrypt.compare(password, dbUser[0].password).then(function(result) {
    if (!result) {
      res.render("login", { error: "Invalid username or password" });
      return;
    } else {
      res.redirect("/");
    }
  })
  
});


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