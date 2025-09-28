import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, AlertTriangle, Clock, Archive } from 'lucide-react';
import type { Task } from '@/store/slices/tasksSlice';

const PriorityMatrix = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority && !task.completed);
  };

  const quadrants = [
    {
      id: 'urgent-important',
      title: 'Do First',
      subtitle: 'Urgent & Important',
      description: 'Crisis and emergencies',
      icon: AlertTriangle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      tasks: getTasksByPriority('urgent-important'),
    },
    {
      id: 'urgent-not-important',
      title: 'Schedule',
      subtitle: 'Urgent, Not Important',
      description: 'Interruptions and distractions',
      icon: Clock,
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      iconColor: 'text-orange-400',
      tasks: getTasksByPriority('urgent-not-important'),
    },
    {
      id: 'not-urgent-important',
      title: 'Decide',
      subtitle: 'Not Urgent, Important',
      description: 'Planning and development',
      icon: Target,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      tasks: getTasksByPriority('not-urgent-important'),
    },
    {
      id: 'not-urgent-not-important',
      title: 'Eliminate',
      subtitle: 'Not Urgent, Not Important',
      description: 'Time wasters and busy work',
      icon: Archive,
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
      iconColor: 'text-gray-400',
      tasks: getTasksByPriority('not-urgent-not-important'),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-glow mb-2">Eisenhower Priority Matrix</h2>
        <p className="text-muted-foreground">
          Organize your tasks by urgency and importance to maximize productivity
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {quadrants.map((quadrant) => (
          <Card
            key={quadrant.id}
            className={`card-professional ${quadrant.bgColor} border-2 ${quadrant.borderColor} hover:shadow-glow transition-all duration-300`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-card/50 ${quadrant.iconColor}`}>
                    <quadrant.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{quadrant.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{quadrant.subtitle}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-card/50">
                  {quadrant.tasks.length}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {quadrant.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {quadrant.tasks.length > 0 ? (
                quadrant.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-card/30 rounded-lg p-4 border border-border/30 hover:bg-card/50 transition-colors"
                  >
                    <h4 className="font-medium mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.dueDate && (
                        <span className="text-orange-400">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <quadrant.icon className={`h-12 w-12 mx-auto mb-3 opacity-50 ${quadrant.iconColor}`} />
                  <p>No tasks in this quadrant</p>
                  <p className="text-xs mt-1">Tasks will appear here based on their priority</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matrix Explanation */}
      <Card className="card-professional mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>How to Use the Priority Matrix</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-red-400">Do First (Urgent + Important)</h4>
            <p className="text-sm text-muted-foreground">
              Handle immediately. These are crises and emergencies that demand instant attention.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-orange-400">Schedule (Urgent, Not Important)</h4>
            <p className="text-sm text-muted-foreground">
              Delegate or minimize. These are interruptions that seem urgent but don't advance your goals.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-400">Decide (Not Urgent, Important)</h4>
            <p className="text-sm text-muted-foreground">
              Plan and schedule. These are activities that contribute to long-term success and goals.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-400">Eliminate (Not Urgent, Not Important)</h4>
            <p className="text-sm text-muted-foreground">
              Avoid or eliminate. These are time-wasters that provide little to no value.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityMatrix;