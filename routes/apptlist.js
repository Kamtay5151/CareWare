var express = require('express');
var router = express.Router();

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

router.get("/apptlist", async (req, res) => {
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
  res.render("apptlist", {appointments, sort});
});

router.post("/apptlist", async (req, res) => {
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
  res.render("apptlist", {appointments, sort});
});

module.exports = router;
