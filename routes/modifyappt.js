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

router.post("/modifyappt", async (req, res) => {
  if (req.session.userid) {
    const db = await dbPromise;
    const { doctor, patient, room, time, appt_id } = req.body;

    //convert time selection to unix/epoch time for DB
    const [datePart, timePart] = time.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    const date = new Date(+year, month - 1, +day, +hours, +minutes, +0);
    const unixTime = Math.floor(date.getTime() / 1000);

    await db.run('UPDATE appointments SET doc_id = ?, patient_id = ?, room_id = ?, time = ? WHERE appt_id = ?', doctor, patient, room, unixTime, appt_id);

    alert("Appointment Updated!");
    res.redirect("/");
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
