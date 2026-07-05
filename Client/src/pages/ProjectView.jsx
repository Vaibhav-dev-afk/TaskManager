import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';

export default function ProjectView() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        const socket = io('http://localhost:3000', { withCredentials: true });
        socket.emit('joinProject', id);

        socket.on('taskCreated', (task) => setTasks((prev) => [...prev, task]));
        socket.on('taskUpdated', (updatedTask) => setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))));
        socket.on('taskDeleted', (taskId) => setTasks((prev) => prev.filter((t) => t._id !== taskId)));

        fetchProjectDetails();
        fetchTasks();

        return () => socket.disconnect();
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const response = await api.get('/projects');
            const currentProject = response.data.find(p => p._id === id);
            setProject(currentProject);
        } catch (error) {
            console.error(error);
        }
    };

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
            await api.post('/tasks', { 
                title, description, priority, dueDate: dueDate || null, assignedTo: assignedTo || null, projectId: id, status: 'todo' 
            });
            setTitle(''); setDescription(''); setPriority('medium'); setDueDate(''); setAssignedTo('');
        } catch (error) {
            console.error(error);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try { await api.put(`/tasks/${taskId}`, { status: newStatus }); } 
        catch (error) { console.error(error); }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm("Delete this task?")) return;
        try { await api.delete(`/tasks/${taskId}`); } 
        catch (error) { console.error(error); }
    };

    const inviteMember = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${id}/invite`, { email: inviteEmail });
            setInviteEmail('');
            fetchProjectDetails();
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to invite user');
        }
    };

    const handleDragStart = (e, taskId) => e.dataTransfer.setData('taskId', taskId);
    const handleDrop = (e, status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) updateTaskStatus(taskId, status);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">{project?.title}</h1>
                    <div className="mt-2 flex gap-2 text-sm text-white/50">
                        {project?.members.map(m => (
                            <span key={m.user._id} className="bg-white/10 px-2 py-1 rounded-md">{m.user.name} ({m.role})</span>
                        ))}
                    </div>
                </div>
                <form onSubmit={inviteMember} className="flex gap-2">
                    <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Invite by Email" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-cyan-400" required />
                    <button type="submit" className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-slate-200">Invite</button>
                </form>
            </div>

            <form onSubmit={createTask} className="mb-8 grid grid-cols-1 md:grid-cols-6 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" className="md:col-span-2 rounded-xl bg-slate-900 px-4 py-2 outline-none border border-white/10" required />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." className="md:col-span-2 rounded-xl bg-slate-900 px-4 py-2 outline-none border border-white/10" />
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-xl bg-slate-900 px-4 py-2 outline-none border border-white/10 text-sm">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl bg-slate-900 px-4 py-2 outline-none border border-white/10 text-sm" />
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="md:col-span-2 rounded-xl bg-slate-900 px-4 py-2 outline-none border border-white/10 text-sm">
                    <option value="">Assign to...</option>
                    {project?.members.map(m => <option key={m.user._id} value={m.user._id}>{m.user.name}</option>)}
                </select>
                <button type="submit" className="md:col-span-4 rounded-xl bg-cyan-500 px-6 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">Create Task</button>
            </form>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                {['todo', 'inprogress', 'done'].map((col) => (
                    <div key={col} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col h-full overflow-y-auto" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, col)}>
                        <h3 className="font-bold text-lg mb-4 capitalize text-cyan-400">{col.replace('inprogress', 'In Progress')}</h3>
                        <div className="flex-1 space-y-4">
                            {tasks.filter((t) => t.status === col).map((task) => (
                                <div key={task._id} draggable onDragStart={(e) => handleDragStart(e, task._id)} className="bg-slate-800 p-4 rounded-xl border border-white/10 cursor-grab hover:border-white/20 shadow-lg relative group">
                                    <button onClick={() => deleteTask(task._id)} className="absolute top-2 right-3 text-rose-400 opacity-0 group-hover:opacity-100 transition">✕</button>
                                    <p className="font-semibold">{task.title}</p>
                                    {task.description && <p className="text-xs text-white/60 mt-1 line-clamp-2">{task.description}</p>}
                                    <div className="mt-3 flex justify-between items-center text-xs">
                                        <span className={`px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10'}`}>{task.priority}</span>
                                        {task.assignedTo && <span className="text-cyan-200">{task.assignedTo.name}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}