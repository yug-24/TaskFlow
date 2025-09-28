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
    console.log('MongoDB URI format check:', process.env.MONGO_URI ? 'URI provided' : 'URI missing');
    
    const connectionOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 1, // Single connection for Replit environment
    };
    
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔄 Starting server without MongoDB connection (will retry on requests)');
    // Don't exit - continue running server
  }
};

// Firebase Admin SDK initialization
const initializeFirebase = () => {
  try {
    console.log('Initializing Firebase Admin SDK...');
    console.log('Firebase env check:', {
      projectId: process.env.FIREBASE_PROJECT_ID ? 'provided' : 'missing',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'provided' : 'missing',
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'provided' : 'missing'
    });
    
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // More robust private key handling
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey) {
        // Handle different newline formats
        privateKey = privateKey.replace(/\\n/g, '\n')
                              .replace(/\\\n/g, '\n')
                              .trim();
                              
        // Ensure proper PEM format
        if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
          throw new Error('Private key must start with -----BEGIN PRIVATE KEY-----');
        }
        if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
          throw new Error('Private key must end with -----END PRIVATE KEY-----');
        }
      }
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: privateKey,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      });
    }
    
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (err) {
    console.error('❌ Firebase initialization error:', err.message);
    console.log('🔄 Starting server without Firebase authentication (auth routes will be disabled)');
    // Don't exit - continue running server without Firebase auth
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