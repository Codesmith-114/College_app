import React from 'react';
import { Bell, RefreshCw, Plus, Calendar, MapPin, Code, BookMarked, ShoppingBag, Loader } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-white">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 w-64 h-screen bg-[var(--bg-card)] border-r border-[var(--border-color)] p-6 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Portal</h1>
                    <p className="text-xs text-gray-500 mt-1">Student Dashboard</p>
                </div>

                <nav className="space-y-2">
                    <NavLink icon="📊" label="Dashboard" active />
                    <NavLink icon="📚" label="Courses" />
                    <NavLink icon="📝" label="Assignments" />
                    <NavLink icon="📅" label="Calendar" />
                    <NavLink icon="🏆" label="Grades" />
                    <NavLink icon="👥" label="Community" />
                </nav>

                <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                    <p className="text-xs text-gray-500 mb-4">Settings</p>
                    <NavLink icon="⚙️" label="Preferences" />
                    <NavLink icon="🔐" label="Security" />
                    <button onClick={() => localStorage.clear()} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition text-sm">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 bg-[var(--bg-main)]">
                {children}
            </main>
        </div>
    );
};

const NavLink = ({ icon, label, active = false }: any) => (
    <button
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${active
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-gray-400 hover:bg-[var(--bg-main)] hover:text-white'
            }`}
    >
        <span>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </button>
);
