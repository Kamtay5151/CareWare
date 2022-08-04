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

app.use('/', require('./routes/index'));

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

app.get("/apptcal", async (req, res) => {
  const db = await dbPromise;
  const appointments = await db.all(`
  select p.patient_givenname, p.patient_surname, d.doc_givenname, d.doc_surname, r.room_number, a.time 
  from appointments a
  INNER JOIN patients p on p.patient_id = a.patient_id
  INNER JOIN doctors d on d.doc_id = a.doc_id
  INNER JOIN rooms r on r.room_id = a.room_id
  ORDER BY a.time
  `);
  res.render("apptcal", {appointments});
});

app.get("/recreq", async (req, res) => {
  const db = await dbPromise;
  const patients = await db.all('SELECT * FROM patients');
  res.render("recreq", {patients});
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

  //convert time selection to unix/epoch time for DB
  const [datePart, timePart] = time.split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  const date = new Date(+year, month - 1, +day, +hours, +minutes, +0);
  const unixTime = Math.floor(date.getTime() / 1000);

  await db.run('INSERT INTO appointments (patient_id, room_id, doc_id, time) VALUES (?, ?, ?, ?)', patient, room, doctor, unixTime);
  alert("Appointment Created!");
  res.redirect("/");
  
});

app.post("/recreq", async (req, res) => {
  const db = await dbPromise;
  const { patient } = req.body;

  const records = await db.all(`
  select p.patient_givenname, p.patient_surname, pr.note
  from patientRecords pr
  INNER JOIN patients p on p.patient_id = pr.patient_id
  WHERE p.patient_id = ?
  `, patient);

  console.log(records)
  
  if (records.length !== 0) {
    res.render("patient_records", {records});
  } else {
    alert("No records available for selected patient");
    res.redirect("/recreq");
  }
  
  
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