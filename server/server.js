const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/product');
const categoryRoutes = require('./src/routes/category');


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
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Api is working...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});