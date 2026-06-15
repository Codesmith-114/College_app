import React, { useState, useEffect } from 'react';
import { 
  Plus, Bell, Settings, RotateCw, CheckCircle2, AlertTriangle, 
  Trash2, BookOpen, Rss, Trophy, Compass, Home, Calculator, 
  MessageSquare, ShoppingBag, Calendar, ChevronDown, ChevronUp, Check, X, SlidersHorizontal
} from 'lucide-react';
import { useTheme, AccentColor, AnimationIntensity } from '../context/ThemeContext';
import { calculateSubjectStats, SubjectAttendance } from '../utils/bunkCalculator';

export const Dashboard: React.FC = () => {
  const { 
    accentColor, setAccentColor, 
    animationIntensity, setAnimationIntensity,
    compactMode, setCompactMode 
  } = useTheme();

  // Simulated User Data
  const [userName] = useState("Arudeep Pandey");
  const [college] = useState("SRM IST (KTR Campus)");
  
  // Dashboard customization state
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // Accordion drawer for holidays
  const [holidaysOpen, setHolidaysOpen] = useState(false);

  // Modal control states for Quick Actions previews
  const [activeQuickActionModal, setActiveQuickActionModal] = useState<string | null>(null);

  // Core Attendance State
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([
    { id: '1', subjectName: '18CSC302J Computer Networks', attendedClasses: 31, totalClasses: 36, requiredPercentage: 75 },
    { id: '2', subjectName: '18CSC305J Software Engineering', attendedClasses: 28, totalClasses: 38, requiredPercentage: 75 },
    { id: '3', subjectName: '18MAB302T Discrete Mathematics', attendedClasses: 42, totalClasses: 48, requiredPercentage: 75 },
    { id: '4', subjectName: '18CSC301T Formal Languages & Automata', attendedClasses: 27, totalClasses: 36, requiredPercentage: 75 },
    { id: '5', subjectName: '18CSC381L Machine Learning Lab', attendedClasses: 12, totalClasses: 12, requiredPercentage: 75 },
    { id: '6', subjectName: '18GEM302T Professional Ethics', attendedClasses: 14, totalClasses: 20, requiredPercentage: 75 }
  ]);

  // Overall Attendance percentages
  const totalAttended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
  const overallPercentage = totalClasses > 0 ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(1)) : 0;

  // Simulator helper: lets user test skipping classes for the first subject
  const [simulateSkipCount, setSimulateSkipCount] = useState(0);

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: '1', title: 'CN Lab Record Submission', subject: 'Computer Networks', dueDate: '2026-06-18', priority: 'high', completed: false },
    { id: '2', title: 'Automata Theory Cycle Test prep', subject: 'Formal Languages', dueDate: '2026-06-19', priority: 'medium', completed: false },
    { id: '3', title: 'ML Project Draft', subject: 'Machine Learning', dueDate: '2026-06-21', priority: 'low', completed: true }
  ]);

  // New task input state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Computer Networks');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // Internal Marks State
  const marksData = [
    { subjectName: 'Computer Networks', ct1: 22.5, ct2: 19.0, model: 44.0, maxCt: 25, maxModel: 50 },
    { subjectName: 'Software Engineering', ct1: 18.5, ct2: 21.0, model: 42.5, maxCt: 25, maxModel: 50 },
    { subjectName: 'Discrete Mathematics', ct1: 24.0, ct2: 23.5, model: 48.0, maxCt: 25, maxModel: 50 },
    { subjectName: 'Formal Languages', ct1: 15.0, ct2: 17.5, model: 38.0, maxCt: 25, maxModel: 50 }
  ];

  // Timetable timeline items
  const todayClasses = [
    { time: '09:00 AM - 09:50 AM', subject: '18CSC302J Computer Networks', room: 'Tech Park 602', faculty: 'Dr. Ramesh Kumar', active: false },
    { time: '10:00 AM - 10:50 AM', subject: '18CSC305J Software Engineering', room: 'Tech Park 301', faculty: 'Dr. Priya Sen', active: true }, // current class simulation
    { time: '11:00 AM - 11:50 AM', subject: '18MAB302T Discrete Mathematics', room: 'Main Block 202', faculty: 'Prof. S. R. Sridhar', active: false }
  ];

  // Holidays log
  const upcomingHolidays = [
    { date: 'June 19, 2026', occasion: 'Juneteenth Institute Holiday' },
    { date: 'June 25, 2026', occasion: 'End Semester Prep Study Leave' },
    { date: 'June 29, 2026', occasion: 'College Fest Special Day Off' }
  ];

  // Dynamic calculations for the simulator card
  const CN_Subject = subjects[0];
  const simAttended = CN_Subject.attendedClasses;
  const simTotal = CN_Subject.totalClasses + simulateSkipCount;
  const simPercentage = simTotal > 0 ? parseFloat(((simAttended / simTotal) * 100).toFixed(1)) : 0;
  const simStatus = simPercentage >= 75 ? 'eligible' : 'ineligible';

  // Synchronize credentials with portal loader
  const triggerSync = () => {
    setSyncing(true);
    setSyncMessage("Connecting to SRM IST Academia portal securely...");
    
    setTimeout(() => {
      setSyncMessage("Decrypting cached authorization credentials...");
    }, 1200);

    setTimeout(() => {
      setSyncMessage("Parsing attendance details and Cycle Test marks...");
    }, 2400);

    setTimeout(() => {
      setSyncing(false);
      setSyncMessage("");
      // Trigger a toast or alert
      alert("Portal Sync Successful! Attendance caches updated to latest university records.");
    }, 3600);
  };

  // Add Task Handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDueDate) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      subject: newTaskSubject,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setShowTaskForm(false);
  };

  // Toggle Task Completion
  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Quick action menu configs
  const quickActions = [
    { id: 'feed', name: 'Feed', icon: Rss, color: 'text-pink-500' },
    { id: 'elib', name: 'E-Library', icon: BookOpen, color: 'text-cyan-500' },
    { id: 'seat', name: 'Seat Finder', icon: Compass, color: 'text-teal-500' },
    { id: 'roomie', name: 'Roommate', icon: Home, color: 'text-purple-500' },
    { id: 'hack', name: 'Hackathons', icon: Trophy, color: 'text-emerald-500' },
    { id: 'cgpa', name: 'CGPA Calc', icon: Calculator, color: 'text-pink-500' },
    { id: 'feedback', name: 'Auto Feedback', icon: MessageSquare, color: 'text-teal-500' },
    { id: 'market', name: 'Marketplace', icon: ShoppingBag, color: 'text-purple-500' },
  ];

  return (
    <div className={`p-6 pb-20 space-y-6 ${compactMode ? 'max-w-6xl mx-auto' : 'w-full'}`}>
      
      {/* 1. TOP HEADER & Personalized Greetings */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-darkBorder pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Good Afternoon, <span className="text-accent drop-shadow-[0_0_10px_var(--color-accent-glow)]">{userName}</span>!
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Portal logged-in via <span className="text-gray-300 font-semibold">{college}</span> • Last synced 2 hours ago
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-accentBorder bg-accent/10 hover:bg-accent/20 text-accent transition-all duration-300 shadow-[0_0_15px_rgba(0,242,254,0.08)]"
          >
            <RotateCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Portal'}
          </button>

          <button className="relative bg-darkCard border border-darkBorder hover:border-gray-700 p-2.5 rounded-xl text-gray-400 hover:text-white transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button 
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className="bg-darkCard border border-darkBorder hover:border-accentBorder p-2.5 rounded-xl text-gray-400 hover:text-accent transition-all shadow-md"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Syncing Progress Overlay banner */}
      {syncing && (
        <div className="bg-darkCard border border-accent/20 rounded-2xl p-4 flex items-center gap-4 animate-pulse shadow-[0_0_15px_rgba(0,242,254,0.15)]">
          <RotateCw className="w-5 h-5 text-accent animate-spin" />
          <p className="text-sm font-medium text-gray-300">{syncMessage}</p>
        </div>
      )}

      {/* Theme Settings Drawer (Customizer) */}
      {showSettingsDrawer && (
        <div className="glass-panel border border-accentBorder/30 rounded-2xl p-5 space-y-4 animate-slide-up shadow-2xl">
          <div className="flex items-center justify-between border-b border-darkBorder pb-2">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent" /> Customize Dashboard Aesthetic
            </h3>
            <button 
              onClick={() => setShowSettingsDrawer(false)} 
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Accent selection */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Accent Tint</span>
              <div className="flex items-center gap-2.5">
                {(['teal', 'pink', 'purple', 'emerald', 'cyan'] as AccentColor[]).map(color => {
                  const colorMap: Record<AccentColor, string> = {
                    teal: 'bg-[#00F2FE]',
                    pink: 'bg-[#FF2E93]',
                    purple: 'bg-[#B026FF]',
                    emerald: 'bg-[#05FFC5]',
                    cyan: 'bg-[#00E5FF]'
                  };
                  return (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform active:scale-90 relative ${colorMap[color]} ${
                        accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-darkBg scale-110' : ''
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Animation intensities */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Animations Speed</span>
              <div className="flex bg-darkCard border border-darkBorder rounded-xl p-1">
                {(['none', 'normal', 'high'] as AnimationIntensity[]).map(intensity => (
                  <button
                    key={intensity}
                    onClick={() => setAnimationIntensity(intensity)}
                    className={`flex-1 text-xs py-1.5 rounded-lg capitalize font-medium transition-all ${
                      animationIntensity === intensity 
                        ? 'bg-accent/10 border border-accent/25 text-accent' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Mode */}
            <div className="space-y-2 flex flex-col justify-center">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Layout Configuration</span>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="rounded border-gray-700 bg-darkCard text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-300 font-medium">Compact Content Width</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACADEMIC PERFORMANCE ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card A: Overall Attendance & Bunk Calculator */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col hover-tilt relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Performance Module
              </span>
              <h2 className="text-xl font-bold text-white mt-1.5">Overall Attendance</h2>
            </div>
            <span className="text-xs text-gray-400">Target requirement: 75%</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-2 flex-1">
            {/* SVG Circular Progress Gauge */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-800" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="38" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className="text-accent circle-gauge" 
                  strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - overallPercentage / 100)}`}
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="38" 
                  cx="50" 
                  cy="50" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{overallPercentage}%</span>
                <span className="text-[10px] uppercase font-bold text-gray-500 mt-0.5">
                  {totalAttended}/{totalClasses} Classes
                </span>
              </div>
            </div>

            {/* Calculations summaries */}
            <div className="flex-1 space-y-3.5 w-full">
              <p className="text-sm text-gray-300 leading-relaxed">
                Your average classroom presence is currently <span className="text-accent font-bold">{overallPercentage >= 75 ? 'Safe' : 'Critical'}</span>. 
              </p>
              
              <div className="bg-darkCard/40 border border-darkBorder rounded-2xl p-3.5 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Interactive Predictor Simulator</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Test skipping upcoming classes:</span>
                    <span className="text-accent font-semibold">+{simulateSkipCount} class(es)</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={simulateSkipCount}
                    onChange={(e) => setSimulateSkipCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs pt-1 border-t border-darkBorder">
                  <span className="text-gray-400">Predicted Attendance:</span>
                  <span className={`font-bold ${simStatus === 'eligible' ? 'text-green-400' : 'text-red-400'}`}>
                    {simPercentage}% ({simStatus === 'eligible' ? 'Safe to skip' : 'BUNK DANGER!'})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card B: Internal Marks & Performance */}
        <div className="glass-panel rounded-3xl p-6 hover-tilt">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Academic Log
              </span>
              <h2 className="text-xl font-bold text-white mt-1.5">Internal Marks</h2>
            </div>
            <span className="text-xs text-gray-400">Scale: 100 total internals</span>
          </div>

          <div className="space-y-4">
            {marksData.map((subj, index) => {
              // Calculate standard total cycle tests
              const totalInternals = subj.ct1 + subj.ct2;
              const ratio = (totalInternals / 50) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300 truncate max-w-[190px]">{subj.subjectName}</span>
                    <span className="text-gray-400 font-medium">
                      CT1: <span className="text-white font-semibold">{subj.ct1}</span>/25 • CT2: <span className="text-white font-semibold">{subj.ct2}</span>/25
                    </span>
                  </div>
                  <div className="w-full h-2 bg-darkCard rounded-full overflow-hidden border border-darkBorder">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        ratio >= 80 ? 'bg-gradient-to-r from-teal-500 to-accent' : 
                        ratio >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 
                        'bg-gradient-to-r from-red-600 to-pink-500'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 3. QUICK ACTIONS GRID */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Quick Action Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveQuickActionModal(action.id)}
                className="glass-panel border border-darkBorder rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all hover-tilt"
              >
                <div className="bg-darkCard p-3 rounded-xl border border-darkBorder shadow-inner group-hover:border-accent">
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-xs font-semibold text-gray-300">{action.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. DETAILS SECTION: UPCOMING TASKS | DYNAMIC DAILY CLASSES / PREDICTIVE WARNINGS | HOLIDAYS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module 4A: Upcoming Tasks */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Upcoming Tasks</h2>
            <button 
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-accentBorder bg-accent/10 text-accent hover:bg-accent/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          {/* Form inline */}
          {showTaskForm && (
            <form onSubmit={handleAddTask} className="bg-darkCard border border-darkBorder p-4 rounded-2xl mb-4 space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Task title..." 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-darkBg border border-darkBorder rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-white w-full"
                  required
                />
                <select 
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="bg-darkBg border border-darkBorder rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-gray-300 w-full"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.subjectName}>{s.subjectName.split(' ').slice(1).join(' ')}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="date" 
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="bg-darkBg border border-darkBorder rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-gray-300 w-full"
                  required
                />
                <select 
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="bg-darkBg border border-darkBorder rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-gray-300 w-full"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="flex-1 bg-accent/20 border border-accent/40 text-accent rounded-xl text-xs font-bold hover:bg-accent/30 transition-all"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowTaskForm(false)}
                    className="px-3 border border-darkBorder hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Task list */}
          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[260px] pr-2">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-10">No pending assignments. Click Add Task to register one!</p>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`border rounded-2xl p-3.5 flex items-center justify-between gap-4 transition-all ${
                    task.completed 
                      ? 'bg-darkCard/30 border-darkBorder opacity-60' 
                      : 'bg-darkCard border-darkBorder hover:border-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                        task.completed 
                          ? 'border-accent bg-accent/15 text-accent' 
                          : 'border-gray-700 hover:border-accent'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold text-gray-200 truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{task.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold flex-shrink-0">{task.dueDate}</span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-600 hover:text-red-400 p-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3 details: Timetable timeline & Holidays */}
        <div className="space-y-6">
          
          {/* Timeline & Attendance warnings */}
          <div className="glass-panel rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Today's Schedule</span>
              <span className="text-[10px] text-accent font-bold px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                ACTIVE
              </span>
            </h3>

            <div className="space-y-3 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-darkBorder">
              {todayClasses.map((item, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                    item.active 
                      ? 'bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(0,242,254,0.3)]' 
                      : 'bg-darkCard border-darkBorder text-gray-500'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  
                  <div className={`flex-1 p-3 rounded-2xl border transition-all ${
                    item.active 
                      ? 'bg-accent/5 border-accent/30 shadow-md' 
                      : 'bg-darkCard/40 border-darkBorder hover:border-gray-800'
                  }`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-gray-500 font-semibold">{item.time}</span>
                      {item.active && <span className="text-[8px] bg-accent/15 text-accent font-bold px-1.5 py-0.5 rounded uppercase">Now</span>}
                    </div>
                    <h4 className="text-xs font-bold text-gray-200 mt-1">{item.subject}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.room} • {item.faculty}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance Alert warning block */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 flex items-start gap-3 shadow-inner">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-400">Predictive Attendance Alert</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  <strong>Formal Languages</strong>: Present attendance is 75.0%. Bunking tomorrow's class will drag you to 72.9% and block your Hall Ticket!
                </p>
              </div>
            </div>
          </div>

          {/* Accordion Holidays Widget */}
          <div className="glass-panel rounded-3xl p-5">
            <button 
              onClick={() => setHolidaysOpen(!holidaysOpen)}
              className="w-full flex items-center justify-between text-sm font-bold text-white"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Holidays in June: 3 Days</span>
              </div>
              {holidaysOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {holidaysOpen && (
              <div className="mt-4 border-t border-darkBorder pt-3.5 space-y-2.5 animate-fade-in">
                {upcomingHolidays.map((holiday, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-darkCard border border-darkBorder p-2.5 rounded-xl text-xs">
                    <span className="font-semibold text-gray-300">{holiday.occasion}</span>
                    <span className="text-gray-500 text-[10px] font-bold">{holiday.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </section>

      {/* QUICK ACTION MODALS PREVIEWS (SIMULATORS) */}
      {activeQuickActionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50 p-4 backdrop-filter backdrop-blur-md">
          <div className="bg-darkCard border border-accent/20 rounded-3xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(0,242,254,0.15)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-darkBorder pb-3">
              <h3 className="font-bold text-lg text-white capitalize">{activeQuickActionModal} Module</h3>
              <button 
                onClick={() => setActiveQuickActionModal(null)} 
                className="text-gray-400 hover:text-white bg-darkBg border border-darkBorder p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-300 leading-relaxed py-2">
              {activeQuickActionModal === 'feed' && (
                <div className="space-y-3">
                  <p>Campus announcements & social posts stream cached from portal.</p>
                  <div className="border border-darkBorder p-3 rounded-2xl bg-darkBg/50 space-y-1">
                    <span className="text-[10px] text-accent font-bold uppercase">DIRECTORATE</span>
                    <h4 className="text-xs font-bold text-white">Graduation Ceremony Dates Announced</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Convocations will begin from July 14, 2026. Online registration opens tonight.</p>
                  </div>
                </div>
              )}
              {activeQuickActionModal === 'elib' && (
                <div className="space-y-3">
                  <p>Access online textbooks, papers, and lab manuals directly.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-darkBg border border-darkBorder p-3 rounded-2xl flex flex-col justify-between h-24">
                      <span className="text-xs font-bold text-white">Computer Networks.pdf</span>
                      <a href="#" className="text-xs text-accent underline mt-2">Download (12.4 MB)</a>
                    </div>
                    <div className="bg-darkBg border border-darkBorder p-3 rounded-2xl flex flex-col justify-between h-24">
                      <span className="text-xs font-bold text-white">Automata Handouts.pdf</span>
                      <a href="#" className="text-xs text-accent underline mt-2">Download (3.8 MB)</a>
                    </div>
                  </div>
                </div>
              )}
              {activeQuickActionModal === 'seat' && (
                <div className="space-y-3">
                  <p>Check where you will be seated for the upcoming examinations.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between bg-darkBg border border-darkBorder p-2.5 rounded-xl text-xs">
                      <span className="font-semibold text-gray-300">18CSC302J Computer Networks</span>
                      <span className="text-accent font-bold">Tech Park 602 (B-12)</span>
                    </div>
                    <div className="flex justify-between bg-darkBg border border-darkBorder p-2.5 rounded-xl text-xs">
                      <span className="font-semibold text-gray-300">18CSC305J Software Engineering</span>
                      <span className="text-accent font-bold">Tech Park 603 (D-4)</span>
                    </div>
                  </div>
                </div>
              )}
              {activeQuickActionModal === 'roomie' && (
                <p>Campus housing profiles list. Filter matching roommates by sleeping, dietary, or project habits.</p>
              )}
              {activeQuickActionModal === 'hack' && (
                <p>Curated list of international and national college hackathons with automatic team building.</p>
              )}
              {activeQuickActionModal === 'cgpa' && (
                <div className="space-y-3">
                  <p>Estimate your Cumulative Grade Point Average.</p>
                  <div className="bg-darkBg border border-darkBorder p-4 rounded-2xl text-center space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Estimated CGPA</span>
                    <h4 className="text-3xl font-extrabold text-accent">8.94</h4>
                    <p className="text-[10px] text-gray-400">Based on 6 active subjects this semester</p>
                  </div>
                </div>
              )}
              {activeQuickActionModal === 'feedback' && (
                <p>Select your teacher names and automatically fill the academic system feedback surveys with customizable ratings.</p>
              )}
              {activeQuickActionModal === 'market' && (
                <div className="space-y-3">
                  <p>College bazaar. Rent or buy lab components, books, or devices.</p>
                  <div className="bg-darkBg border border-darkBorder p-3 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white">Calculus and Analytic Geometry (11th Ed)</h4>
                      <p className="text-[10px] text-gray-500">Seller: Rahul Sharma (KTR Hostels)</p>
                    </div>
                    <span className="text-xs font-bold text-accent">₹350</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setActiveQuickActionModal(null)} 
                className="px-5 py-2 rounded-xl text-xs bg-darkBorder hover:bg-gray-800 text-gray-300 hover:text-white transition-all font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Dashboard;
