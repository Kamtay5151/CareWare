var express = require('express');
var router = express.Router();

import alert from 'alert';

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
  select pr.note, pr.record_id
  from patientRecords pr
  WHERE pr.patient_id = ?
  `, patient);

  const info = await db.all(`
  select pi.sex, pi.dob, pi.height_feet, pi.height_in, pi.weight, pi.patient_id
  from patientInfo pi
  WHERE pi.patient_id = ?
  `, patient);

  const patientName = await db.all(`
  select p.patient_givenname, p.patient_surname
  from patients p 
  WHERE p.patient_id = ?
  `, patient);

  console.log(records)
  console.log(info)
  
  if (records.length !== 0 || info.length !== 0) {
    res.render("patient_records", {records, info, patientName});
  } else {
    alert("No records available for selected patient");
    res.redirect("/recreq");
  }
  
  
});

module.exports = router;
