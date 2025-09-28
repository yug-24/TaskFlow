import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SplineBackground from '@/components/ui/spline-background';
import { ArrowRight, CheckCircle, Target, Timer, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <SplineBackground />
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <div className="text-2xl font-bold text-glow">TaskFlow Pro</div>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="btn-hero">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Productivity</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            The ultimate task management platform with AI-powered suggestions, 
            real-time collaboration, and beautiful 3D interactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="btn-hero text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="btn-glass text-lg px-8 py-4">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-4 gap-6 mt-16 animate-slide-up">
            {[
              { icon: CheckCircle, title: 'Smart Tasks', desc: 'AI-powered task organization' },
              { icon: Target, title: 'Priority Matrix', desc: 'Eisenhower decision matrix' },
              { icon: Timer, title: 'Pomodoro', desc: 'Built-in focus timer' },
              { icon: Users, title: 'Real-time Sync', desc: 'Collaborate seamlessly' },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="card-glass p-6 text-center hover:bg-white/10 transition-all duration-300"
                
              >
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6 text-muted-foreground">
        <p>&copy; 2024 TaskFlow Pro. Elevate your productivity.</p>
      </footer>
    </div>
  );
};

export default Landing;