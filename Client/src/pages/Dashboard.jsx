import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}</h1>
            {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-white/70 text-sm">Total Projects</h3>
                        <p className="text-4xl font-semibold mt-2">{stats.totalProjects}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-white/70 text-sm">To Do</h3>
                        <p className="text-4xl font-semibold mt-2">{stats.todo || 0}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-white/70 text-sm">In Progress</h3>
                        <p className="text-4xl font-semibold mt-2 text-cyan-400">{stats.inprogress || 0}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-white/70 text-sm">Done</h3>
                        <p className="text-4xl font-semibold mt-2 text-emerald-400">{stats.done || 0}</p>
                    </div>
                </div>
            ) : (
                <p className="text-white/50">Loading stats...</p>
            )}
        </div>
    );
}