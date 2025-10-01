import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchTasks } from '@/store/slices/tasksSlice';
import { fetchHabits } from '@/store/slices/habitsSlice';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TasksView from '@/components/dashboard/TasksView';
import PriorityMatrix from '@/components/dashboard/PriorityMatrix';
import PomodoroTimer from '@/components/dashboard/PomodoroTimer';
import HabitsView from '@/components/dashboard/HabitsView';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchHabits());
  }, [dispatch]);

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksView />;
      case 'matrix':
        return <PriorityMatrix />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'habits':
        return <HabitsView />;

      default:
        return <TasksView />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>

      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;