import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import admin from 'firebase-admin';
import os from 'os';

dotenv.config(); // Load .env

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI check:', process.env.MONGO_URI ? '✅ Provided' : '❌ Missing');

    const connectionOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1,
    };

    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// Firebase Admin SDK initialization
let isFirebaseInitialized = false;

const initializeFirebase = () => {
  try {
    console.log('Initializing Firebase Admin SDK...');
    console.log('Firebase env check:', {
      projectId: process.env.FIREBASE_PROJECT_ID ? '✅ Provided' : '❌ Missing',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? '✅ Provided' : '❌ Missing',
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? '✅ Provided' : '❌ Missing',
    });

    if (admin.apps.length === 0) {
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n').trim();
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });

      isFirebaseInitialized = true;
    }

    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (err) {
    console.error('❌ Firebase initialization error:', err.message);
    isFirebaseInitialized = false;
  }
};

// Authentication middleware
const verifyToken = async (req, res, next) => {
  try {
    if (!isFirebaseInitialized) {
      return res.status(503).json({ error: 'Authentication service unavailable' });
    }

    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized - No token provided' });

    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Import routes
import tasksRouter from './routes/tasks.js';
import habitsRouter from './routes/habits.js';

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskFlow Pro Backend is running', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/tasks', verifyToken, tasksRouter);
app.use('/api/habits', verifyToken, habitsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  initializeFirebase();

  app.listen(PORT, () => {
    const networkInterfaces = os.networkInterfaces();
    let networkURL = '';

    for (const iface of Object.values(networkInterfaces)) {
      for (const config of iface) {
        if (config.family === 'IPv4' && !config.internal) {
          networkURL = `http://${config.address}:${PORT}`;
        }
      }
    }

    console.log(`\n🚀 TaskFlow Pro Backend running!`);
    console.log(`📍 Local:   http://localhost:${PORT}`);
    if (networkURL) console.log(`🌐 Network: ${networkURL}`);
    console.log(`📊 Health:  http://localhost:${PORT}/health`);
    console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
    console.log(`🎯 Habits API: http://localhost:${PORT}/api/habits\n`);
  });
};

startServer();

