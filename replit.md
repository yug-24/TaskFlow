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
- **2025-09-28**: Imported from Lovable project and configured for Replit environment
  - Updated Vite config for port 5000 and host compatibility
  - Set up deployment configuration for autoscale
  - Verified all dependencies and functionality

## Current State
✅ Application running successfully on port 5000
✅ Firebase authentication configured
✅ All UI components and routing working
✅ Deployment configuration set up
⚠️ WebGL context warnings from Spline component (cosmetic only, doesn't affect functionality)

## User Preferences
- Modern React development patterns
- TypeScript for type safety
- Component-based architecture
- Responsive design principles