import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

interface DashboardData {
    user: {
        name: string;
        email: string;
        department: string;
        semester: number;
        themePreferences: any;
    };
    attendance: {
        overall: number;
        safeSkips: number;
        subjects: any[];
        summary: {
            safe: number;
            atRisk: number;
            critical: number;
        };
    };
    tasks: {
        upcoming: any[];
        todaysClasses: any[];
    };
}

export function useDashboard(userId: string | null) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await dashboardAPI.getDashboardData(userId);
                setData(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load dashboard data');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh data every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [userId]);

    const refetch = async () => {
        if (!userId) return;
        try {
            const response = await dashboardAPI.getDashboardData(userId);
            setData(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reload dashboard');
        }
    };

    return { data, loading, error, refetch };
}
