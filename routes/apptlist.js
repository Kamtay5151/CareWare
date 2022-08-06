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

router.get("/apptlist", async (req, res) => {
  if (req.session.userid) {
    const db = await dbPromise;
    const sort = "time";
    const appointments = await db.all(`
  select p.patient_givenname, p.patient_surname, d.doc_givenname, d.doc_surname, r.room_number, a.time, a.appt_id 
  from appointments a
  INNER JOIN patients p on p.patient_id = a.patient_id
  INNER JOIN doctors d on d.doc_id = a.doc_id
  INNER JOIN rooms r on r.room_id = a.room_id
  ORDER BY a.time
  `);
    res.render("apptlist", { appointments, sort });
  } else {
    res.redirect('/login');
  }
});

router.post("/apptlist", async (req, res) => {
  if (req.session.userid) {
    const db = await dbPromise;
    const { sort } = req.body;
    const appointments = await db.all(`
  select p.patient_givenname, p.patient_surname, p.patient_id, d.doc_givenname, d.doc_surname, d.doc_id, r.room_number, r.room_id, a.time, a.appt_id 
  from appointments a
  INNER JOIN patients p on p.patient_id = a.patient_id
  INNER JOIN doctors d on d.doc_id = a.doc_id
  INNER JOIN rooms r on r.room_id = a.room_id
  ORDER BY a.time
  `);
    res.render("apptlist", { appointments, sort });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
