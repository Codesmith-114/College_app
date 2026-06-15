import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import collegeRoutes from './routes/collegeRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import taskRoutes from './routes/taskRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-dashboard';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date(),
    databaseConnected: mongoose.connection.readyState === 1
  });
});

// Start DB & Express Server
console.log('[Server] Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('[Server] Connected to MongoDB database successfully.');
  })
  .catch(err => {
    console.error('[Server] MongoDB connection error:', err.message);
    console.warn('[Server] Express will start anyway with SQLite/Memory mock cache logic.');
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`[Server] Core Student Dashboard API running at http://localhost:${PORT}`);
    });
  });

export default app;
