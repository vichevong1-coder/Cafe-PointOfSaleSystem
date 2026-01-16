const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');

dotenv.config();

connectDB();
const corsOptions = {
  origin: 'http://localhost:3001', // Frontend Next.js default port
  credentials: true,
  optionsSuccessStatus: 200,
};
const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Api is working...');
});

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});