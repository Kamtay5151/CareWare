var express = require('express');
var router = express.Router();

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

router.get("/recreq", async (req, res) => {
  const db = await dbPromise;
  const patients = await db.all('SELECT * FROM patients');
  res.render("recreq", {patients});
});

router.post("/recreq", async (req, res) => {
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

module.exports = router;
