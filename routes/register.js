var express = require('express');
var router = express.Router();

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { username, password, passwordRepeat } = req.body;

  if (password !== passwordRepeat) {
    res.render("register", { error: "Passwords must match" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const dbUser = await db.all('SELECT username FROM users where username = ?', username);

  if (dbUser[0]) {
    res.render("register", { error: "Username already registered" });
    return;
  } else {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, passwordHash);
  }
 
  res.redirect("/");
});

module.exports = router;
