import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: HabitsState = {
  habits: [
    {
      id: '1',
      name: 'Read for 30 minutes',
      description: 'Daily reading to improve knowledge',
      target: 30,
      completed: 25,
      streak: 7,
      bestStreak: 15,
      createdAt: '2024-01-01',
      lastCompleted: '2024-01-10',
    },
    {
      id: '2',
      name: 'Exercise',
      description: 'Daily workout routine',
      target: 1,
      completed: 1,
      streak: 3,
      bestStreak: 10,
      createdAt: '2024-01-01',
      lastCompleted: '2024-01-10',
    },
    {
      id: '3',
      name: 'Meditate',
      description: 'Daily meditation for mindfulness',
      target: 15,
      completed: 0,
      streak: 0,
      bestStreak: 5,
      createdAt: '2024-01-01',
    },
  ],
  loading: false,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'completed'>>) => {
      const newHabit: Habit = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        streak: 0,
        bestStreak: 0,
        completed: 0,
      };
      state.habits.push(newHabit);
    },
    updateHabit: (state, action: PayloadAction<{ id: string; updates: Partial<Habit> }>) => {
      const { id, updates } = action.payload;
      const habitIndex = state.habits.findIndex(habit => habit.id === id);
      if (habitIndex !== -1) {
        state.habits[habitIndex] = { ...state.habits[habitIndex], ...updates };
      }
    },
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(habit => habit.id !== action.payload);
    },
    incrementHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(habit => habit.id === action.payload);
      if (habit && habit.completed < habit.target) {
        habit.completed += 1;
        if (habit.completed === habit.target) {
          habit.streak += 1;
          habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
          habit.lastCompleted = new Date().toISOString();
        }
      }
    },
    resetDailyProgress: (state) => {
      state.habits.forEach(habit => {
        habit.completed = 0;
      });
    },
  },
});

export const { 
  addHabit, 
  updateHabit, 
  deleteHabit, 
  incrementHabit, 
  resetDailyProgress 
} = habitsSlice.actions;
export default habitsSlice.reducer;