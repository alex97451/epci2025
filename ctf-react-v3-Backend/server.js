const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
var cors = require('cors');
app.use(express.json());

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.run('CREATE TABLE users(id INTEGER PRIMARY KEY, username TEXT, password TEXT, bio TEXT, isAdmin INTEGER)', (err) => {
  if (err) {
    return console.error(err.message);
  }
  db.run(`INSERT INTO users(username, password, bio, isAdmin) VALUES(?, ?, ?, ?)`, ['admin', 'password', 'I am admin', 1]);
});

app.post('/login', (req, res) => {
  let sql = `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
  db.get(sql, [], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      res.cookie('session', '123');
      res.json({ success: true, bio: row.bio, isAdmin: row.isAdmin });
    } else {
      res.json({ success: false });
    }
  });
});

app.listen(3001, () => console.log('Server started on port 3001'));
