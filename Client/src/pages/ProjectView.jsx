import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';

export default function ProjectView() {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        const socket = io('http://localhost:3000', { withCredentials: true });
        socket.emit('joinProject', id);

        socket.on('taskCreated', (task) => {
            setTasks((prev) => [...prev, task]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
        });

        fetchTasks();

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const fetchTasks = async () => {
        try {
            const response = await api.get(`/tasks/project/${id}`);
            setTasks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { title, projectId: id, status: 'todo' });
            setTitle('');
        } catch (error) {
            console.error(error);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
        } catch (error) {
            console.error(error);
        }
    };

    const inviteMember = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${id}/invite`, { email: inviteEmail });
            setInviteEmail('');
            alert('Member invited successfully');
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to invite user');
        }
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) updateTaskStatus(taskId, status);
    };

    const columns = ['todo', 'inprogress', 'done'];

    return (
        <div className="h-full flex flex-col">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                <form onSubmit={createTask} className="flex gap-4 w-full md:w-auto">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Task Title" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-cyan-400" required />
                    <button type="submit" className="rounded-xl bg-cyan-500 px-6 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 whitespace-nowrap">Add Task</button>
                </form>
                <form onSubmit={inviteMember} className="flex gap-4 w-full md:w-auto">
                    <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Invite by Email" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-cyan-400" required />
                    <button type="submit" className="rounded-xl bg-white px-6 py-2 font-semibold text-slate-950 transition hover:bg-slate-200 whitespace-nowrap">Invite</button>
                </form>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                {columns.map((col) => (
                    <div 
                        key={col} 
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col h-full overflow-y-auto"
                        onDragOver={(e) => e.preventDefault()} 
                        onDrop={(e) => handleDrop(e, col)}
                    >
                        <h3 className="font-bold text-lg mb-4 capitalize text-cyan-400">{col.replace('inprogress', 'In Progress')}</h3>
                        <div className="flex-1 space-y-4">
                            {tasks.filter((t) => t.status === col).map((task) => (
                                <div 
                                    key={task._id} 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, task._id)} 
                                    className="bg-slate-800 p-5 rounded-xl border border-white/10 cursor-grab active:cursor-grabbing hover:border-white/20 transition shadow-lg"
                                >
                                    <p className="font-semibold">{task.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}