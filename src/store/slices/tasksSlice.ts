import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
  dueDate?: string;
  createdAt: string;
  order: number;
}

interface TasksState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

const initialState: TasksState = {
  tasks: [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the quarterly project proposal for the client meeting',
      completed: false,
      priority: 'urgent-important',
      dueDate: '2024-01-15',
      createdAt: '2024-01-10',
      order: 0,
    },
    {
      id: '2',
      title: 'Review team performance',
      description: 'Conduct quarterly reviews for all team members',
      completed: false,
      priority: 'not-urgent-important',
      createdAt: '2024-01-10',
      order: 1,
    },
    {
      id: '3',
      title: 'Update documentation',
      description: 'Update project documentation and API guides',
      completed: true,
      priority: 'not-urgent-not-important',
      createdAt: '2024-01-09',
      order: 2,
    },
  ],
  filter: 'all',
  loading: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'order'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        order: state.tasks.length,
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
  },
});

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  toggleTask, 
  reorderTasks, 
  setFilter 
} = tasksSlice.actions;
export default tasksSlice.reducer;