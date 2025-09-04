import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import propertyRoutes from './src/routes/properties.js';
import orderRoutes from './src/routes/orders.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/orders', orderRoutes);

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/realestate';
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URL).then(() => {
  console.log('Mongo connected');
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}).catch((err) => {
  console.error('Mongo connection error', err);
  process.exit(1);
});


