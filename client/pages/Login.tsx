// pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Loader, LogIn } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        portalId: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.portalId || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await authAPI.login(formData.portalId, formData.password);

            // Store token and user ID
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userId', response.data.user.id);
            localStorage.setItem('userName', response.data.user.name);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                                <LogIn size={24} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white">College Portal</h1>
                        <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Portal ID</label>
                            <input
                                type="text"
                                name="portalId"
                                value={formData.portalId}
                                onChange={handleChange}
                                placeholder="e.g., BIT2024001"
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-white placeholder-gray-500 focus:border-[var(--color-primary)] focus:outline-none transition"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-white placeholder-gray-500 focus:border-[var(--color-primary)] focus:outline-none transition"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">Demo Credentials</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Portal ID: <span className="text-[var(--color-accent)]">BIT2024001</span><br />
                            Password: <span className="text-[var(--color-accent)]">password123</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
