var express = require('express');
var router = express.Router();

import alert from 'alert';

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

router.get("/newrecord", async (req, res) => {
  res.render("newrecord", {recordType:null, doctors:null, patients:null, rooms:null});
});

router.post("/newrecord", async (req, res) => {
  const db = await dbPromise;
  const { recordType, initialLoad, doc_givenname, doc_surname, patient_givenname, patient_surname, room_number, patient, doctor, room, time } = req.body;

  if (recordType && initialLoad) {
    if (recordType == "appt") {
      const doctors = await db.all('SELECT * FROM doctors');
      const rooms = await db.all('SELECT * FROM rooms');
      const patients = await db.all('SELECT * FROM patients');
      res.render("newrecord", {recordType, doctors, rooms, patients});
    }
    res.render("newrecord", {recordType});
  } else {
  if (recordType == "doctor") {
    await db.run('INSERT INTO doctors (doc_givenname, doc_surname) VALUES (?, ?)', doc_givenname, doc_surname)
    alert("Doctor Added!");
    res.redirect("/");
  } else if (recordType == "patient") {
    await db.run('INSERT INTO patients (patient_givenname, patient_surname) VALUES (?, ?)', patient_givenname, patient_surname)
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
    }
  }
});

module.exports = router;
