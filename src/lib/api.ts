import axios from 'axios';
import { auth } from './firebase';

// API base URL - use localhost for backend in development
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Task API functions
export const taskAPI = {
  // Get all tasks for authenticated user
  getTasks: () => api.get('/tasks'),
  
  // Create a new task
  createTask: (task: { task: string; deadline?: Date }) => 
    api.post('/tasks', task),
  
  // Update a task
  updateTask: (id: string, updates: Partial<{ task: string; completed: boolean; deadline: Date }>) => 
    api.put(`/tasks/${id}`, updates),
  
  // Delete a task
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};

// Habit API functions
export const habitAPI = {
  // Get all habits for authenticated user
  getHabits: () => api.get('/habits'),
  
  // Create a new habit
  createHabit: (habit: { habit: string }) => 
    api.post('/habits', habit),
  
  // Update a habit
  updateHabit: (id: string, updates: Partial<{ habit: string; streak: number; progress: Date[] }>) => 
    api.put(`/habits/${id}`, updates),
  
  // Delete a habit
  deleteHabit: (id: string) => api.delete(`/habits/${id}`),
};

export default api;