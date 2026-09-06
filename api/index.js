// api/index.js - Vercel serverless entry point for the TaskFlow API
import { app } from '../backend/app.js';
import { connectDB } from '../backend/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
    });
    return;
  }

  return app(req, res);
}
