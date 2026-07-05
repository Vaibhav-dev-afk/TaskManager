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
                <>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-white/70 text-sm">Projects</h3>
                            <p className="text-3xl font-semibold mt-2">{stats.totalProjects}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-white/70 text-sm">To Do</h3>
                            <p className="text-3xl font-semibold mt-2">{stats.todo || 0}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-white/70 text-sm">In Progress</h3>
                            <p className="text-3xl font-semibold mt-2 text-cyan-400">{stats.inprogress || 0}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-white/70 text-sm">Done</h3>
                            <p className="text-3xl font-semibold mt-2 text-emerald-400">{stats.done || 0}</p>
                        </div>
                        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl">
                            <h3 className="text-rose-200/70 text-sm">Overdue</h3>
                            <p className="text-3xl font-semibold mt-2 text-rose-400">{stats.overdue || 0}</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">My Assigned Tasks</h2>
                    <div className="space-y-4">
                        {stats.recentTasks?.length > 0 ? (
                            stats.recentTasks.map(task => (
                                <div key={task._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-sm text-white/50">{task.project?.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10'}`}>{task.priority}</span>
                                        {task.dueDate && <p className="text-xs text-white/40 mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/50">You have no pending assigned tasks.</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-white/50">Loading dashboard...</p>
            )}
        </div>
    );
}