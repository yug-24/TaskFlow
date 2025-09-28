import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, Timer, Coffee, Target } from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const { toast } = useToast();

  const sessionTimes = {
    work: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60,
  };

  const sessionNames = {
    work: 'Focus Time',
    'short-break': 'Short Break',
    'long-break': 'Long Break',
  };

  const sessionIcons = {
    work: Target,
    'short-break': Coffee,
    'long-break': Coffee,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (currentSession === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      const newSession = completedPomodoros + 1 >= 4 ? 'long-break' : 'short-break';
      setCurrentSession(newSession);
      setTimeLeft(sessionTimes[newSession]);
      
      toast({
        title: 'Work Session Complete!',
        description: `Great job! Time for a ${newSession === 'long-break' ? 'long' : 'short'} break.`,
      });
    } else {
      setCurrentSession('work');
      setTimeLeft(sessionTimes.work);
      
      toast({
        title: 'Break Complete!',
        description: 'Ready to start your next focus session?',
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionTimes[currentSession]);
  };

  const changeSession = (session: 'work' | 'short-break' | 'long-break') => {
    setIsRunning(false);
    setCurrentSession(session);
    setTimeLeft(sessionTimes[session]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionTimes[currentSession] - timeLeft) / sessionTimes[currentSession]) * 100;
  const SessionIcon = sessionIcons[currentSession];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-glow mb-2">Pomodoro Timer</h2>
        <p className="text-muted-foreground">
          Boost your productivity with focused work sessions
        </p>
      </div>

      {/* Main Timer Card */}
      <Card className="card-professional max-w-md mx-auto mb-8">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <SessionIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">{sessionNames[currentSession]}</CardTitle>
          </div>
          
          <div className="text-6xl font-mono font-bold text-glow mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={progress} 
            className="w-full h-2 mb-4"
          />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={toggleTimer}
              className={isRunning ? "btn-glass" : "btn-hero"}
              size="lg"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="btn-glass"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-center">
            <Select value={currentSession} onValueChange={changeSession}>
              <SelectTrigger className="w-full bg-card/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Focus Time (25m)</SelectItem>
                <SelectItem value="short-break">Short Break (5m)</SelectItem>
                <SelectItem value="long-break">Long Break (15m)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-professional text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary mb-2">{completedPomodoros}</div>
            <div className="text-sm text-muted-foreground">Completed Sessions</div>
          </CardContent>
        </Card>

        <Card className="card-professional text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-accent mb-2">
              {Math.floor(completedPomodoros * 25 / 60)}h {(completedPomodoros * 25) % 60}m
            </div>
            <div className="text-sm text-muted-foreground">Focus Time Today</div>
          </CardContent>
        </Card>

        <Card className="card-professional text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {completedPomodoros >= 4 ? Math.floor(completedPomodoros / 4) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Cycles Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Technique Info */}
      <Card className="card-professional mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-primary" />
            <span>Pomodoro Technique</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Work for 25 minutes with full focus</li>
              <li>• Take a 5-minute break</li>
              <li>• After 4 cycles, take a 15-30 minute break</li>
              <li>• Repeat the process</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Benefits:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Improves focus and concentration</li>
              <li>• Reduces mental fatigue</li>
              <li>• Increases productivity</li>
              <li>• Better time awareness</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;