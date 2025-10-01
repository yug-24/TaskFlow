import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../lib/api';

export interface Habit {
  id: string;
  name: string;
  description: string;
  target: number; // daily target
  completed: number; // completed today
  streak: number;
  bestStreak: number;
  createdAt: string;
  lastCompleted?: string;
}

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null,
};

// 🔥 Async thunks
export const fetchHabits = createAsyncThunk('habits/fetchHabits', api.fetchHabits);

export const createHabit = createAsyncThunk(
  'habits/createHabit',
  async (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'completed'>) => {
    return api.createHabit(habit);
  }
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async ({ id, updates }: { id: string; updates: Partial<Habit> }) => {
    return api.updateHabit(id, updates);
  }
);

export const deleteHabit = createAsyncThunk('habits/deleteHabit', async (id: string) => {
  await api.deleteHabit(id);
  return id;
});

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load habits';
      })
      // Create
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })
      // Update
      .addCase(updateHabit.fulfilled, (state, action) => {
        const idx = state.habits.findIndex((h) => h.id === action.payload.id);
        if (idx !== -1) state.habits[idx] = action.payload;
      })
      // Delete
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter((h) => h.id !== action.payload);
      });
  },
});

export default habitsSlice.reducer;