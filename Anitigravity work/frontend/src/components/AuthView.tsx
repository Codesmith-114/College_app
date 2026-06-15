import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User, Compass, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AuthViewProps {
  onLoginSuccess: (userData: any) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const { accentColor } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('SRM IST');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API authorization response for frontend-only capability, 
    // fall back dynamically to network request or seed mock database cache.
    const mockUserData = {
      id: 'mock-user-id-123456',
      name: name || (isLogin ? 'Arudeep Pandey' : 'New User'),
      email: email || 'student@srmist.edu.in',
      college: college,
      themePreferences: {
        accentColor: accentColor,
        animationIntensity: 'normal',
        compactMode: false
      }
    };
    
    onLoginSuccess(mockUserData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#08090C] relative overflow-hidden">
      {/* Background radial gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-darkCard/60 border border-darkBorder hover:border-accentBorder/30 rounded-3xl p-8 backdrop-filter backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 space-y-6">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-accent/10 p-3 rounded-2xl border border-accent/20 animate-pulse-slow">
            <GraduationCap className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
            {isLogin ? 'Welcome back to AURA' : 'Create Student Account'}
          </h2>
          <p className="text-gray-400 text-xs">
            {isLogin ? 'Sync academic metrics with your university portal' : 'Start tracking attendance, marks, and tests'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..." 
                  className="w-full bg-darkBg border border-darkBorder hover:border-gray-700 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none text-white transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu..." 
                className="w-full bg-darkBg border border-darkBorder hover:border-gray-700 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none text-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Portal Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-darkBg border border-darkBorder hover:border-gray-700 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none text-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">University Network</label>
            <div className="relative">
              <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-darkBg border border-darkBorder hover:border-gray-700 focus:border-accent rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none text-gray-300 transition-colors"
              >
                <option value="SRM IST">SRM IST (Academia Hub)</option>
                <option value="IIT Bombay">IIT Bombay (ASC Portal)</option>
                <option value="IIT Madras">IIT Madras (Workflow Node)</option>
                <option value="NIT Trichy">NIT Trichy (Moodle Link)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-darkBg font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_var(--color-accent-glow)] mt-2"
          >
            <span>{isLogin ? 'Sign In & Connect' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Tab Switcher */}
        <div className="text-center pt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-400 hover:text-accent transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already registered? Log in'}
          </button>
        </div>

      </div>
    </div>
  );
};
export default AuthView;
