// backend/app.js - Express app definition (no listen/dev-server logic here)
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { globalSearch } from './controllers/searchController.js';
import { protect } from './middleware/authMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

export const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TaskFlow API',
    timestamp: new Date().toISOString(),
  });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/api/search', protect, globalSearch);

// Error handling middleware for API routes
app.use('/api', notFound);
app.use(errorHandler);
