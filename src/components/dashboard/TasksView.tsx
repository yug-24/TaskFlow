import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RootState } from '@/store/store';
import { addTask, updateTask, deleteTask, toggleTask, setFilter } from '@/store/slices/tasksSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Check, Circle, Users } from 'lucide-react';
import type { Task } from '@/store/slices/tasksSlice';

const TasksView = () => {
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector((state: RootState) => state.tasks);
  const { toast } = useToast();
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'not-urgent-not-important' as Task['priority'],
    dueDate: '',
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Task title is required',
        variant: 'destructive',
      });
      return;
    }

    dispatch(addTask({ ...newTask, completed: false }));
    setNewTask({
      title: '',
      description: '',
      priority: 'not-urgent-not-important',
      dueDate: '',
    });
    setIsAddingTask(false);
    
    toast({
      title: 'Task Added',
      description: 'Your task has been added successfully',
    });
  };

  const handleEditTask = () => {
    if (!editingTask || !newTask.title.trim()) return;

    dispatch(updateTask({
      id: editingTask.id,
      updates: newTask,
    }));
    
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'not-urgent-not-important',
      dueDate: '',
    });
    
    toast({
      title: 'Task Updated',
      description: 'Your task has been updated successfully',
    });
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
    toast({
      title: 'Task Deleted',
      description: 'Task has been removed',
    });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent-important':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'urgent-not-important':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'not-urgent-important':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent-important':
        return 'Urgent & Important';
      case 'urgent-not-important':
        return 'Urgent';
      case 'not-urgent-important':
        return 'Important';
      default:
        return 'Low Priority';
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-glow mb-2">Tasks</h2>
            <p className="text-muted-foreground">Manage your tasks with drag & drop organization</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Real-time collaboration indicator */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>2 users active</span>
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-primary rounded-full border-2 border-background" />
                <div className="w-6 h-6 bg-accent rounded-full border-2 border-background" />
              </div>
            </div>
            
            <Select value={filter} onValueChange={(value: any) => dispatch(setFilter(value))}>
              <SelectTrigger className="w-[140px] bg-card/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="card-professional">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Create a new task with priority and due date
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter task description..."
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: Task['priority']) => 
                          setNewTask(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent-important">Urgent & Important</SelectItem>
                          <SelectItem value="urgent-not-important">Urgent</SelectItem>
                          <SelectItem value="not-urgent-important">Important</SelectItem>
                          <SelectItem value="not-urgent-not-important">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask} className="btn-hero">
                      Add Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="card-professional hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => dispatch(toggleTask(task.id))}
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      {task.completed ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      )}
                    </button>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        {task.dueDate && (
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog 
                      open={editingTask?.id === task.id} 
                      onOpenChange={(open) => !open && setEditingTask(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="card-professional">
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                          <DialogDescription>
                            Update task details and priority
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input
                              value={newTask.title}
                              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Enter task title..."
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={newTask.description}
                              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Enter task description..."
                              className="mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Priority</label>
                              <Select
                                value={newTask.priority}
                                onValueChange={(value: Task['priority']) => 
                                  setNewTask(prev => ({ ...prev, priority: value }))
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="urgent-important">Urgent & Important</SelectItem>
                                  <SelectItem value="urgent-not-important">Urgent</SelectItem>
                                  <SelectItem value="not-urgent-important">Important</SelectItem>
                                  <SelectItem value="not-urgent-not-important">Low Priority</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Due Date</label>
                              <Input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setEditingTask(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditTask} className="btn-hero">
                              Update Task
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {filter === 'completed' ? 'No completed tasks yet' : 
               filter === 'active' ? 'No active tasks' : 'No tasks yet'}
            </div>
            <Button onClick={() => setIsAddingTask(true)} className="btn-hero">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TasksView;