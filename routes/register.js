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
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

router.get("/register", async (req, res) => {
  if (req.session.userid) {
    res.render("register");
  } else {
    res.redirect('/login');
  }
});

router.post("/register", async (req, res) => {
  if (req.session.userid) {
    const db = await dbPromise;
    const { username, password, passwordRepeat } = req.body;

    if (password !== passwordRepeat) {
      alert("Passwords must match");
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const dbUser = await db.all('SELECT username FROM users where username = ?', username);

    if (dbUser[0]) {
      alert("Username already registered");
      return;
    } else {
      await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, passwordHash);
      alert("User Registered!")
    }

    res.redirect("/");
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
