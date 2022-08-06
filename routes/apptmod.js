var express = require('express');
var router = express.Router();

import alert from 'alert';

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

var cookieParser = require('cookie-parser');
const sessions = require('express-session');
var session;
const oneDay = 1000 * 60 * 60 * 24;
router.use(sessions({
  secret: "CareWareSuperS3cr3tK3y!Chang3M3!",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

router.post("/apptmod", async (req, res) => {
  if (req.session.userid) {
    const db = await dbPromise;
    const { appt_id } = req.body;
    const appointment = await db.all(`
  select * 
  from appointments a
  WHERE a.appt_id = ?
  `, appt_id);
    const doctors = await db.all('SELECT * FROM doctors');
    const rooms = await db.all('SELECT * FROM rooms');
    const patients = await db.all('SELECT * FROM patients');
    res.render("apptmod", { doctors, rooms, patients, appointment });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
