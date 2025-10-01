# TaskFlow Pro - Productivity Dashboard

## Overview
TaskFlow Pro is a React-based productivity dashboard application with Firebase authentication. It features task management, priority matrix, Pomodoro timer, habit tracking, and 3D interactive elements using Spline.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Routing**: React Router DOM
- **Data Fetching**: TanStack React Query
- **3D Graphics**: Spline for background animations

## Project Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and Firebase config
├── pages/             # Page components
└── store/             # Redux store and slices
```

## Key Features
1. **Landing Page**: Interactive 3D background with Spline animations
2. **Authentication**: Firebase-powered sign in/up
3. **Dashboard**: Task management, priority matrix, Pomodoro timer, habits tracking
4. **Real-time Sync**: Firebase integration for data persistence
5. **Responsive Design**: Mobile-first design with Tailwind CSS

## Development Setup
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 with allowedHosts: true for proxy compatibility
- **Build Tool**: Vite with React SWC plugin
- **Package Manager**: npm

## Firebase Configuration
The project uses Firebase for authentication with the following services:
- Authentication (email/password)
- Project ID: taskflow-4821b

## Recent Changes
- **2025-10-01**: GitHub import configured for Replit environment
  - Installed Node.js 20 and all frontend/backend dependencies
  - Configured Vite for port 5000 with allowedHosts: true for proxy compatibility
  - Set up workflow to run both backend (port 3000) and frontend (port 5000) concurrently
  - Configured deployment as VM to maintain both services running
  - Verified application loads successfully with landing page and all features
- **2025-09-28**: Imported from Lovable project and configured for Replit environment
  - Updated Vite config for port 5000 and host compatibility
  - Set up deployment configuration for autoscale
  - Verified all dependencies and functionality

## Current State
✅ **Frontend**: Application running successfully on port 5000
✅ **Backend**: Express server running on port 3000 with CRUD APIs
✅ **Frontend-Backend Integration**: API client configured for localhost communication
✅ **Security**: User isolation implemented with sanitized update operations
✅ **Error Handling**: Graceful fallbacks for MongoDB and Firebase failures
✅ **Deployment**: VM configuration set up for production
✅ **Dependencies**: All npm packages installed for frontend and backend
⚠️ **MongoDB**: Connection requires MONGO_URI environment variable to be set
⚠️ **Firebase Admin**: Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables
⚠️ **WebGL**: Context warnings from Spline component (cosmetic only, does not affect functionality)

## Backend Architecture
- **Server**: Express.js with CORS and JSON parsing
- **Database**: MongoDB with Mongoose ODM (graceful failure handling)
- **Authentication**: Firebase Admin SDK with JWT token verification
- **Security**: 
  - User data isolation via Firebase UID
  - Sanitized update operations (userId cannot be overwritten)
  - Ownership validation on all CRUD operations
- **Error Handling**: Continues running even when external services fail

## User Preferences
- Modern React development patterns
- TypeScript for type safety
- Component-based architecture
- Responsive design principles