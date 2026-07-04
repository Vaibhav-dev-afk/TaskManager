import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

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

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Projects</h1>
            <form onSubmit={createProject} className="mb-10 bg-white/5 border border-white/10 p-6 rounded-2xl max-w-xl space-y-4">
                <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl bg-white/5 px-4 py-3 text-white outline-none border border-white/10 focus:border-cyan-400" required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl bg-white/5 px-4 py-3 text-white outline-none border border-white/10 focus:border-cyan-400" required />
                <button type="submit" className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-xl font-semibold hover:bg-cyan-400 transition">Create Project</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition cursor-pointer">
                        <h2 className="text-xl font-bold">{project.title}</h2>
                        <p className="text-white/60 mt-2 line-clamp-2">{project.description}</p>
                        <div className="mt-6 flex justify-between items-center text-sm text-white/40">
                            <span>{project.members?.length || 1} Members</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}