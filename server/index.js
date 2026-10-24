const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const indexedRouter = require('./routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/', indexedRouter);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});