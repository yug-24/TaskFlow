import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { createHabit, updateHabit, deleteHabit } from '@/store/slices/habitsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Flame, 
  Target, 
  TrendingUp, 
  Calendar,
  Trophy,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { Habit } from '@/store/slices/habitsSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HabitsView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { habits, loading, error } = useSelector((state: RootState) => state.habits);
  
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    target: 1,
  });

  const handleAddHabit = () => {
    if (!newHabit.name.trim()) {
      return;
    }

    dispatch(createHabit(newHabit));
    setNewHabit({ name: '', description: '', target: 1 });
    setIsAddingHabit(false);
  };

  const handleEditHabit = () => {
    if (!editingHabit || !newHabit.name.trim()) return;

    dispatch(updateHabit({
      id: editingHabit.id,
      updates: newHabit,
    }));
    
    setEditingHabit(null);
    setNewHabit({ name: '', description: '', target: 1 });
  };

  const handleDeleteHabit = (id: string) => {
    dispatch(deleteHabit(id));
  };

  const startEditing = (habit: Habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      description: habit.description,
      target: habit.target,
    });
  };

  // Mock data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const streakData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Daily Habits Completed',
        data: [3, 2, 4, 3, 4, 2, 3], // Mock data
        borderColor: 'hsl(217 91% 60%)',
        backgroundColor: 'hsl(217 91% 60% / 0.1)',
        tension: 0.4,
      },
    ],
  };

  const habitCompletionData = {
    labels: habits.map(habit => habit.name),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: habits.map(habit => (habit.completed / habit.target) * 100),
        backgroundColor: habits.map((_, index) => 
          `hsl(${217 + index * 40} 91% 60% / 0.8)`
        ),
        borderColor: habits.map((_, index) => 
          `hsl(${217 + index * 40} 91% 60%)`
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'hsl(0 0% 65%)',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(0 0% 65%)',
        },
        grid: {
          color: 'hsl(0 0% 15%)',
        },
      },
      y: {
        ticks: {
          color: 'hsl(0 0% 65%)',
        },
        grid: {
          color: 'hsl(0 0% 15%)',
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-glow mb-2">Habit Tracker</h2>
          <p className="text-muted-foreground">Build lasting habits and track your progress</p>
        </div>
        
        <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
          <DialogTrigger asChild>
            <Button className="btn-hero mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="card-professional">
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
              <DialogDescription>
                Create a new habit to track daily progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Read for 30 minutes"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Why is this habit important to you?"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Daily Target</label>
                <Input
                  type="number"
                  min="1"
                  value={newHabit.target}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingHabit(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddHabit} className="btn-hero">
                  Add Habit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p>Loading habits...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Habits Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {habits.map((habit) => (
          <Card key={habit.id} className="card-professional hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{habit.name}</CardTitle>
                  {habit.description && (
                    <CardDescription className="mt-1">{habit.description}</CardDescription>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(habit)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress Today</span>
                  <span>{habit.completed}/{habit.target}</span>
                </div>
                <Progress 
                  value={(habit.completed / habit.target) * 100} 
                  className="h-2"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-lg font-bold text-orange-400">{habit.streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-lg font-bold text-yellow-400">{habit.bestStreak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Best Streak</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-lg font-bold text-green-400">
                      {Math.round((habit.completed / habit.target) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                disabled={habit.completed >= habit.target}
                className={habit.completed >= habit.target ? "btn-glass" : "btn-hero"}
                size="sm"
              >
                {habit.completed >= habit.target ? (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Completed Today!
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Mark Progress
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={streakData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Today's Completion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={habitCompletionData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog 
        open={editingHabit !== null} 
        onOpenChange={(open) => !open && setEditingHabit(null)}
      >
        <DialogContent className="card-professional">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update your habit details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Habit Name</label>
              <Input
                value={newHabit.name}
                onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Read for 30 minutes"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Why is this habit important to you?"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Daily Target</label>
              <Input
                type="number"
                min="1"
                value={newHabit.target}
                onChange={(e) => setNewHabit(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingHabit(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditHabit} className="btn-hero">
                Update Habit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">No habits yet</div>
          <Button onClick={() => setIsAddingHabit(true)} className="btn-hero">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Habit
          </Button>
        </div>
      )}
    </div>
  );
};

export default HabitsView;
