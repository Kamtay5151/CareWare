var express = require('express');
var router = express.Router();

import alert from 'alert';

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

router.post("/apptmod", async (req, res) => {
  const db = await dbPromise;
  const { apptId } = req.body;
  const appointment = await db.all(`
  select * 
  from appointments a
  WHERE a.appt_id = ?
  `, apptId);
  const doctors = await db.all('SELECT * FROM doctors');
  const rooms = await db.all('SELECT * FROM rooms');
  const patients = await db.all('SELECT * FROM patients');
  res.render("apptmod", {doctors, rooms, patients, appointment});
});

module.exports = router;
