var express = require('express');
var router = express.Router();

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});


/* GET home page. */
router.get('/', async function(req, res, next) {
  const db = await dbPromise;
  const appointments = await db.all("SELECT * FROM appointments;");
  console.log(appointments);
  res.render('index', { 
    title: 'CareWare' ,
    appointments
  });
});

module.exports = router;
