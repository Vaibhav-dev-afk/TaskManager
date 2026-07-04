import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', { title, description });
            setTitle('');
            setDescription('');
            fetchProjects();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteProject = async (e, projectId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/projects/${projectId}`);
            fetchProjects();
        } catch (error) {
            alert(error?.response?.data?.message || "Failed to delete project");
        }
    };

    return (
        <div className="mx-auto max-w-5xl">
            <h1 className="mb-8 text-3xl font-bold">Projects</h1>
            <form onSubmit={createProject} className="mb-10 max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400" required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400" required />
                <button type="submit" className="rounded-xl bg-cyan-500 px-6 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">Create Project</button>
            </form>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {projects.map((project) => (
                    <div key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold">{project.title}</h2>
                                <p className="mt-2 line-clamp-2 text-white/60">{project.description}</p>
                            </div>
                            <button onClick={(e) => deleteProject(e, project._id)} className="text-rose-400 transition hover:text-rose-300">✕</button>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-sm text-white/40">
                            <span>{project.members?.length || 1} Members</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}