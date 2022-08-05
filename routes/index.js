var express = require('express');
var router = express.Router();

import alert from 'alert';

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});


/* GET home page. */
router.get('/', async function(req, res, next) {
  const db = await dbPromise;
  const appointments = await db.all(`
  select p.patient_givenname, p.patient_surname, d.doc_givenname, d.doc_surname, r.room_number, a.time, a.appt_id 
  from appointments a
  INNER JOIN patients p on p.patient_id = a.patient_id
  INNER JOIN doctors d on d.doc_id = a.doc_id
  INNER JOIN rooms r on r.room_id = a.room_id
  WHERE a.time >= strftime('%s', 'now')
  ORDER BY a.time
  LIMIT 5;
  `);
  console.log(appointments);
  res.render('index', { 
    title: 'CareWare' ,
    appointments
  });
});

module.exports = router;
