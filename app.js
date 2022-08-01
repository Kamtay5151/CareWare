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
app.get("/newappt", async (req, res) => {
  const db = await dbPromise;
  const doctors = await db.all('SELECT * FROM doctors');
  const rooms = await db.all('SELECT * FROM rooms');
  const patients = await db.all('SELECT * FROM patients');
  res.render("newappt", {doctors, rooms, patients});
});

app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { username, password, passwordRepeat } = req.body;

  if (password !== passwordRepeat) {
    res.render("register", { error: "Passwords must match" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const dbUser = await db.all('SELECT username FROM users where username = ?', username);

  if (dbUser[0]) {
    res.render("register", { error: "Username already registered" });
    return;
  } else {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, passwordHash);
  }
 
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

app.post("/newappt", async (req, res) => {
  const db = await dbPromise;
  const { doctor, patient, room, time } = req.body;

  const [docSurname, docGivenName] = doctor.split(', ')
  const [patientSurname, patientGivenName] = patient.split(', ')

  const DBdoc = await db.all('SELECT doc_id FROM doctors where doc_givenname = ? and doc_surname = ?', docGivenName, docSurname);
  const DBpatient = await db.all('SELECT patient_id FROM patients where patient_givenname = ? and patient_surname = ?', patientGivenName, patientSurname);
  const DBroom = await db.all('SELECT room_id FROM rooms where room_number = ?', room);

  //convert time selection to unix/epoch time for DB
  const [datePart, timePart] = time.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  const date = new Date(+year, month - 1, +day, +hours, +minutes, +0);
  const unixTime = Math.floor(date.getTime() / 1000);

  await db.run('INSERT INTO appointments (patient_id, room_id, doc_id, time) VALUES (?, ?, ?, ?)', DBpatient[0].patient_id, DBroom[0].room_id, DBdoc[0].doc_id, unixTime);
  alert("Appointment Created!");
  res.redirect("/");
  
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