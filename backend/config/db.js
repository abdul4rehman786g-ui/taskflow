// backend/config/db.js
import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  // Reuse existing connection across serverless invocations (avoids exhausting
  // MongoDB connection limits when this runs as a Vercel function).
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('⚡ No MONGODB_URI found in environment. Starting local MongoMemoryServer for development/hackathon preview...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        uri = mongoMemoryServer.getUri();
        console.log('✅ Local MongoDB instance running at:', uri);
      } catch (memErr) {
        console.warn('⚠️ Could not start MongoMemoryServer fallback:', memErr.message);
      }
    }

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is required and local fallback unavailable.');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Do not terminate process violently to let error handlers explain missing connection
    throw error;
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};
