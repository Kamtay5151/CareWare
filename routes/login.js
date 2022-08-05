var express = require('express');
var router = express.Router();

import sqlite3 from 'sqlite3';
import { open } from "sqlite";
const dbPromise = open({
  filename: "careware.db",
  driver: sqlite3.Database,
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const dbUser = await db.all('SELECT password FROM users where username = ?', username);

  await bcrypt.compare(password, dbUser[0].password).then(function(result) {
    if (!result) {
      res.render("login", { error: "Invalid username or password" });
      return;
    } else {
      res.redirect("/");
    }
  })
  
});

module.exports = router;
