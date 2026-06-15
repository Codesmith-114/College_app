import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Rss, Trophy, Presentation, Newspaper, 
  Users, Home, Compass, CheckSquare, BarChart3, Clock, Calendar, 
  Calculator, MessageSquareCode, Orbit, ShoppingBag, LogOut, ChevronLeft, ChevronRight, GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuSections = [
    {
      title: "EXPLORE",
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'elibrary', name: 'E-Library', icon: BookOpen },
        { id: 'feed', name: 'Feed', icon: Rss },
        { id: 'hackathons', name: 'Hackathons', icon: Trophy },
        { id: 'conferences', name: 'Conferences', icon: Presentation },
        { id: 'news', name: 'Tech News', icon: Newspaper },
      ]
    },
    {
      title: "FINDER",
      items: [
        { id: 'teamfinder', name: 'Team Finder', icon: Users },
        { id: 'roommate', name: 'Roommate Finder', icon: Home },
        { id: 'seatfinder', name: 'Exam Seat Finder', icon: Compass },
      ]
    },
    {
      title: "ACADEMICS",
      items: [
        { id: 'attendance', name: 'Attendance', icon: CheckSquare },
        { id: 'marks', name: 'Marks', icon: BarChart3 },
        { id: 'timetable', name: 'Timetable', icon: Clock },
        { id: 'calendar', name: 'Calendar', icon: Calendar },
        { id: 'cgpa', name: 'CGPA Calc', icon: Calculator },
        { id: 'feedback', name: 'Feedback', icon: MessageSquareCode },
      ]
    },
    {
      title: "FOR CLUBS",
      items: [
        { id: 'synergy', name: 'Synergy Circles', icon: Orbit }, // Renamed uniquely from Club Hub
      ]
    },
    {
      title: "UTILITIES",
      items: [
        { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag },
      ]
    }
  ];

  return (
    <aside 
      className={`glass-panel border-r border-darkBorder flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-darkBorder h-20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-accent/15 p-2 rounded-xl border border-accent/30 shadow-[0_0_15px_rgba(0,242,254,0.1)] animate-pulse-slow">
            <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              AURA PORTAL
            </span>
          )}
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-darkBorder p-1.5 rounded-lg border border-transparent hover:border-darkBorder transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {!isCollapsed && (
              <span className="text-[10px] font-bold tracking-widest text-gray-600 block px-3">
                {section.title}
              </span>
            )}
            <ul className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm transition-all relative group ${
                        isActive 
                          ? 'bg-accent/10 border border-accent/25 text-accent shadow-[0_0_12px_rgba(0,242,254,0.08)]' 
                          : 'text-gray-400 hover:text-white hover:bg-darkCard/50 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${
                        isActive ? 'scale-105' : 'group-hover:scale-105'
                      }`} />
                      
                      {!isCollapsed && <span className="font-medium">{item.name}</span>}
                      
                      {/* Hover slide indicator */}
                      {!isCollapsed && !isActive && (
                        <div className="absolute left-0 top-1/4 h-1/2 w-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-all rounded-r" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sign Out Section */}
      <div className="p-4 border-t border-darkBorder">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
