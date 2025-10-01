import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../lib/api';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority:
    | 'urgent-important'
    | 'urgent-not-important'
    | 'not-urgent-important'
    | 'not-urgent-not-important';
  dueDate?: string;
  createdAt: string;
  order: number;
}

interface TasksState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  filter: 'all',
  loading: false,
  error: null,
};

// 🔥 Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', api.fetchTasks);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    return api.createTask(task);
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    return api.updateTask(id, updates);
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await api.deleteTask(id);
  return id;
});

export const toggleTask = createAsyncThunk('tasks/toggleTask', async (id: string) => {
  return api.toggleTask(id);
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setFilter: (
      state,
      action: PayloadAction<'all' | 'active' | 'completed'>
    ) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load tasks';
      })
      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      // Toggle
      .addCase(toggleTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      });
  },
});

export const { reorderTasks, setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;
