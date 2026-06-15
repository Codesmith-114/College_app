import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AuthView } from './components/AuthView';
import { BookOpen, Rss, Trophy, Orbit, ShoppingBag, Landmark } from 'lucide-react';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('user-session');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user-session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user-session');
    setActiveTab('dashboard');
  };

  if (!user) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  // Sub-pages Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'elibrary':
        return (
          <div className="p-8 text-center space-y-4">
            <BookOpen className="w-16 h-16 mx-auto text-accent animate-bounce" />
            <h2 className="text-2xl font-bold">E-Library Resources</h2>
            <p className="text-gray-400 max-w-md mx-auto">Access digital textbook caches, syllabus PDF sheets, and semester exam question banks for SRM IST courses.</p>
          </div>
        );
      case 'feed':
        return (
          <div className="p-8 text-center space-y-4">
            <Rss className="w-16 h-16 mx-auto text-accent animate-pulse" />
            <h2 className="text-2xl font-bold">Campus Feed</h2>
            <p className="text-gray-400 max-w-md mx-auto">Real-time alerts, department updates, and club recruitment announcements.</p>
          </div>
        );
      case 'hackathons':
        return (
          <div className="p-8 text-center space-y-4">
            <Trophy className="w-16 h-16 mx-auto text-accent animate-spin-slow" />
            <h2 className="text-2xl font-bold font-sans">Hackathons & Projects</h2>
            <p className="text-gray-400 max-w-md mx-auto">Explore current student hackathons, register teams, and find tech partners.</p>
          </div>
        );
      case 'synergy':
        return (
          <div className="p-8 text-center space-y-4">
            <Orbit className="w-16 h-16 mx-auto text-accent animate-pulse" />
            <h2 className="text-2xl font-bold text-accent font-sans uppercase">Synergy Circles</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Our reimagined and unique club alliance framework! Co-ordinate with student clubs, register for hackathons, review tech teams, and manage community projects.
            </p>
          </div>
        );
      case 'marketplace':
        return (
          <div className="p-8 text-center space-y-4">
            <ShoppingBag className="w-16 h-16 mx-auto text-accent" />
            <h2 className="text-2xl font-bold">Student Marketplace</h2>
            <p className="text-gray-400 max-w-md mx-auto">Trade notebooks, scientific gear, laptops, and hostel furniture within the student network.</p>
          </div>
        );
      default:
        return (
          <div className="p-8 text-center space-y-4">
            <Landmark className="w-16 h-16 mx-auto text-accent" />
            <h2 className="text-2xl font-bold capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h2>
            <p className="text-gray-400">This module is connected and syncing backend values from the college API.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F3F4F6] flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      {/* Main Panel Content (Shifted by Sidebar size of 64 or 20 when collapsed) */}
      <main className="flex-1 transition-all duration-300 ml-20 md:ml-64 min-w-0">
        {renderTabContent()}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
