// pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { Bell, RefreshCw, Plus, Calendar, MapPin, Code, BookMarked, ShoppingBag, Loader } from 'lucide-react';
import { dashboardAPI } from '../services/api';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface DashboardData {
    user: any;
    attendance: any;
    tasks: any;
}

const QuickAction = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <motion.div variants={itemVariants} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col items-center gap-3 hover:border-[var(--color-primary)] transition cursor-pointer">
        <div className="text-3xl">{icon}</div>
        <p className="text-sm font-medium text-center">{label}</p>
    </motion.div>
);

const TimelineItem = ({ time, subject, room, active = false }: any) => (
    <div className={`flex gap-4 pb-4 border-l-2 pl-4 ${active ? 'border-[var(--color-primary)]' : 'border-[var(--border-color)]'}`}>
        <div className="flex flex-col gap-1">
            <p className={`font-semibold ${active ? 'text-white' : 'text-gray-400'}`}>{subject}</p>
            <p className="text-xs text-gray-500">{time} • {room}</p>
        </div>
        {active && (
            <div className="ml-auto flex items-center gap-2 text-[var(--color-accent)] text-xs font-semibold px-2 py-1 bg-[var(--color-accent)]/10 rounded-full">
                <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse"></span>
                Now
            </div>
        )}
    </div>
);

const SubjectCard = ({ subject }: any) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SAFE': return 'text-green-400';
            case 'AT_RISK': return 'text-orange-400';
            case 'CRITICAL': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const circumference = 2 * Math.PI * 36;
    const strokeDashoffset = circumference - (subject.percentage / 100) * circumference;

    return (
        <motion.div variants={itemVariants} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
            <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="transform -rotate-90 w-24 h-24" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="36" fill="none" stroke="var(--border-color)" strokeWidth="4" />
                        <circle
                            cx="50"
                            cy="50"
                            r="36"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="absolute text-center">
                        <p className="text-lg font-bold text-white">{subject.percentage}%</p>
                        <p className={`text-xs ${getStatusColor(subject.status)}`}>{subject.status}</p>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-white">{subject.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{subject.code}</p>
                    <p className="text-sm text-gray-400">{subject.attended}/{subject.total} classes</p>
                    <p className={`text-xs mt-1 ${getStatusColor(subject.status)}`}>{subject.status}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Get userId from localStorage or props
    const userId = localStorage.getItem('userId');

    const fetchDashboardData = async () => {
        try {
            if (!userId) {
                setError('User not found. Please login.');
                setLoading(false);
                return;
            }

            setRefreshing(true);
            const response = await dashboardAPI.getDashboardData(userId);
            setData(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [userId]);

    if (loading) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="text-[var(--color-primary)] animate-spin" />
                        <p className="text-gray-400">Loading your dashboard...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto flex items-center justify-center h-96">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
                        <p className="text-red-400 font-semibold mb-4">{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto text-center py-12">
                    <p className="text-gray-400">No data available</p>
                </div>
            </Layout>
        );
    }

    const today = new Date();
    const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-400">{dayFormatter.format(today)}</p>
                        <h1 className="text-3xl font-bold text-white mt-1">Good Afternoon, {data.user.name.split(' ')[0]}!</h1>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchDashboardData}
                            disabled={refreshing}
                            className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:text-[var(--color-primary)] transition disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                        </button>
                        <button className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:text-white transition relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="flex items-center gap-2 bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                            <Plus size={18} /> Create Task
                        </button>
                    </div>
                </header>

                {/* Dynamic Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Attendance Overview Card */}
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="text-[10px] font-bold tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded">ACADEMIC</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-4">Overall Attendance</h3>
                        <div className="flex items-center gap-8">
                            {/* Circular Progress */}
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="transform -rotate-90 w-32 h-32" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="var(--color-primary)"
                                        strokeWidth="3"
                                        strokeDasharray={`${(data.attendance.overall / 100) * 251.2} 251.2`}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute text-center">
                                    <p className="text-3xl font-bold text-white">{data.attendance.overall}%</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Safe to skip</p>
                                <p className="text-2xl font-bold text-white">{Math.max(0, data.attendance.safeSkips)} Classes</p>
                                <p className="text-xs text-green-400 mt-1">Above 75% Mandate</p>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        <span className="text-gray-400">Safe: {data.attendance.summary.safe}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                        <span className="text-gray-400">At Risk: {data.attendance.summary.atRisk}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                        <span className="text-gray-400">Critical: {data.attendance.summary.critical}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions Grid */}
                    <motion.div variants={itemVariants} className="col-span-1 grid grid-cols-2 gap-4">
                        <QuickAction icon={<MapPin className="text-blue-400" />} label="Seat Finder" />
                        <QuickAction icon={<Code className="text-green-400" />} label="Hackathons" />
                        <QuickAction icon={<BookMarked className="text-purple-400" />} label="E-Library" />
                        <QuickAction icon={<ShoppingBag className="text-orange-400" />} label="Marketplace" />
                    </motion.div>

                    {/* Today's Schedule */}
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
                        <div className="space-y-4">
                            {data.tasks.todaysClasses.length > 0 ? (
                                data.tasks.todaysClasses.map((cls, idx) => (
                                    <TimelineItem
                                        key={cls.id}
                                        time={new Date(cls.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        subject={cls.title}
                                        room={cls.subject || 'TBD'}
                                        active={idx === 0}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No classes scheduled today</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Upcoming Tasks Widget */}
                    <motion.div variants={itemVariants} className="col-span-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="text-[var(--color-accent)]" />
                            <h3 className="text-lg font-semibold">Upcoming</h3>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {data.tasks.upcoming.length > 0 ? (
                                data.tasks.upcoming.slice(0, 4).map(task => (
                                    <div key={task.id} className="border-l-2 border-[var(--color-primary)] pl-3 py-2">
                                        <p className="text-sm font-semibold text-white truncate">{task.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</p>
                                        <span className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                                task.priority === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No upcoming tasks</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Subject-wise Attendance */}
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Subject-wise Attendance</h3>
                            <button className="text-sm text-[var(--color-primary)] hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {data.attendance.subjects.map(subject => (
                                <SubjectCard key={subject.id} subject={subject} />
                            ))}
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </Layout>
    );
}
