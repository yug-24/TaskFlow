import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import admin from 'firebase-admin';

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Firebase Admin SDK initialization
const initializeFirebase = () => {
  try {
    console.log('Initializing Firebase Admin SDK...');
    
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      });
    }
    
    console.log('Firebase Admin SDK initialized successfully');
  } catch (err) {
    console.error('Firebase initialization error:', err);
    process.exit(1);
  }
};

// Authentication middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    console.log('Verifying Firebase token...');
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    console.log('Token verified for user:', req.userId);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Import routes
import tasksRouter from './routes/tasks.js';
import habitsRouter from './routes/habits.js';

// Health check route (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TaskFlow Pro Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API routes (with authentication)
app.use('/api/tasks', verifyToken, tasksRouter);
app.use('/api/habits', verifyToken, habitsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize services and start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    initializeFirebase();
    
    app.listen(PORT, 'localhost', () => {
      console.log(`🚀 TaskFlow Pro Backend server running on http://localhost:${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
      console.log(`🎯 Habits API: http://localhost:${PORT}/api/habits`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();