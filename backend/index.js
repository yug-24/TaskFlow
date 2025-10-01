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
app.use(express.json({ limit: '10mb' }));

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5000',
      'http://localhost:3000',
      'http://127.0.0.1:5000',
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    ].filter(Boolean);
    
    if (!origin) {
      callback(null, true);
      return;
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development' && (origin.endsWith('.replit.dev') || origin.includes('localhost'))) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'production' && process.env.ALLOW_VERCEL_PREVIEW === 'true' && origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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

// Initialize connections
const initializeServices = async () => {
  await connectDB();
  initializeFirebase();
};

// Initialize services on startup
let initialized = false;
const ensureInitialized = async () => {
  if (!initialized) {
    await initializeServices();
    initialized = true;
  }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  
  const startServer = async () => {
    await ensureInitialized();

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
}

export default async (req, res) => {
  await ensureInitialized();
  return app(req, res);
};

