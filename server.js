// server.js - TaskFlow local dev/prod entry point (Express + Vite)
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

import { app } from './backend/app.js';
import { connectDB } from './backend/config/db.js';
import { initDefaultDemoUsers } from './backend/utils/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const PORT = process.env.PORT || 3000;

  // Connect Database
  try {
    await connectDB();
    await initDefaultDemoUsers();
  } catch (err) {
    console.error('Database initialization warning:', err.message);
  }

  // Development Vite Middleware or Production Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TaskFlow server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
