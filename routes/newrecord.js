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

router.get("/newrecord", async (req, res) => {
  if (req.session.userid) {
    res.render("newrecord", { recordType: null, doctors: null, patients: null, rooms: null });
  } else {
    res.redirect('/login');
  }
});

router.post("/newrecord", async (req, res) => {
  if (req.session.userid) {
    const db = await dbPromise;
    const { recordType, initialLoad, doc_givenname, doc_surname, patient_givenname, patient_surname, patient_sex, patient_dob, patient_height_feet, patient_height_in, patient_weight, room_number, patient, doctor, room, time, note } = req.body;

    if (recordType && initialLoad) {
      if (recordType == "appt") {
        const doctors = await db.all('SELECT * FROM doctors');
        const rooms = await db.all('SELECT * FROM rooms');
        const patients = await db.all('SELECT * FROM patients');
        res.render("newrecord", { recordType, doctors, rooms, patients });
      }
      if (recordType == "note") {
        const patients = await db.all('SELECT * FROM patients');
        res.render("newrecord", { recordType, patients });
      }
      res.render("newrecord", { recordType });
    } else {
      if (recordType == "doctor") {
        await db.run('INSERT INTO doctors (doc_givenname, doc_surname) VALUES (?, ?)', doc_givenname, doc_surname)
        alert("Doctor Added!");
        res.redirect("/");
      } else if (recordType == "patient") {
        const newPatient = await db.run('INSERT INTO patients (patient_givenname, patient_surname) VALUES (?, ?) RETURNING *', patient_givenname, patient_surname)
        console.log(newPatient.lastID)
        await db.run('INSERT INTO patientInfo (patient_id, sex, dob, height_feet, height_in, weight) VALUES (?, ?, ?, ?, ?, ?)', newPatient.lastID, patient_sex, patient_dob, patient_height_feet, patient_height_in, patient_weight)
        alert("Patient Added!");
        res.redirect("/");
      } else if (recordType == "room") {
        await db.run('INSERT INTO rooms (room_number) VALUES (?)', room_number)
        alert("Room Added!");
        res.redirect("/");
      } else if (recordType == "appt") {
        //convert time selection to unix/epoch time for DB
        const [datePart, timePart] = time.split('T');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');
        const date = new Date(+year, month - 1, +day, +hours, +minutes, +0);
        const unixTime = Math.floor(date.getTime() / 1000);

        await db.run('INSERT INTO appointments (patient_id, room_id, doc_id, time) VALUES (?, ?, ?, ?)', patient, room, doctor, unixTime);
        alert("Appointment Created!");
        res.redirect("/");
      } else if (recordType == "note") {
        await db.run('INSERT INTO patientRecords (note, patient_id) VALUES (?, ?)', note, patient)
        alert("Note Added!");
        res.redirect("/");
      }
    }
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
