import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import eventRoutes from './routes/event.route.js';
import authRoutes from './routes/auth.route.js';
import swapRoutes from './routes/swapRequest.route .js';
import { connect } from './lib/db.js';

dotenv.config();

const app = express(); // ✅ create the express app

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/swap-request', swapRoutes);


// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  connect();
  console.log(`Backend server is running on port ${PORT}!`);
});
