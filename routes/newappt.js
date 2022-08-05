var express = require('express');
var router = express.Router();

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

router.get("/newappt", async (req, res) => {
  const db = await dbPromise;
  const doctors = await db.all('SELECT * FROM doctors');
  const rooms = await db.all('SELECT * FROM rooms');
  const patients = await db.all('SELECT * FROM patients');
  res.render("newappt", {doctors, rooms, patients});
});

router.post("/newappt", async (req, res) => {
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

module.exports = router;
