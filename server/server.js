const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Api is working...');
});

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});