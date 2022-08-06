var express = require('express');
var router = express.Router();

import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
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
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  console.log(username, password)

  const dbUser = await db.all('SELECT password FROM users where username = ?', username);
  console.log(dbUser)
  if (dbUser.length == 0) {
    alert("Invalid username");
    return;
  } else {
    await bcrypt.compare(password, dbUser[0].password).then(function(result) {
      if (!result) {
        alert("Invalid username or password");
        return;
      } else {
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.redirect("/");
      }
    })
  }  
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
