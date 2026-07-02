import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';

export default function Dashboard() {
	const [projects, setProjects] = useState([]);
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [error, setError] = useState('');
	const [projectsError, setProjectsError] = useState('');

	useEffect(() => {
		let mounted = true;

		const loadStats = async () => {
			try {
				setLoading(true);
				setError('');
				const { data } = await api.get('/dashboard/stats');
				if (mounted) setStats(data);
			} catch (err) {
				if (mounted) setError(err?.response?.data?.message || 'Failed to load dashboard stats.');
			} finally {
				if (mounted) setLoading(false);
			}
		};

		const loadProjects = async () => {
			try {
				setProjectsLoading(true);
				setProjectsError('');
				const { data } = await api.get('/projects');
				const projectList = Array.isArray(data) ? data : [];
				if (mounted) {
					setProjects(projectList);
					setSelectedProjectId((current) => current || projectList[0]?._id || '');
				}
			} catch (err) {
				if (mounted) {
					setProjectsError(err?.response?.data?.message || 'Failed to load projects.');
				}
			} finally {
				if (mounted) setProjectsLoading(false);
			}
		};

		loadProjects();
		loadStats();

		return () => {
			mounted = false;
		};
	}, []);

	const selectedProject = useMemo(
		() => projects.find((project) => project._id === selectedProjectId) || null,
		[projects, selectedProjectId]
	);

	const cards = [
		{ key: 'totalProjects', label: 'Projects' },
		{ key: 'to-do', label: 'To do' },
		{ key: 'inprogress', label: 'In progress' },
		{ key: 'completed', label: 'Completed' },
	];

	return (
		<div className="min-h-screen bg-slate-950 text-white">
			<Navbar />
			<div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
				<Sidebar />
				<main className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
							<p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
								Track project throughput and task progress from one clean overview.
							</p>
						</div>
					</div>

					{error ? (
						<div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
							{error}
						</div>
					) : null}

					<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{cards.map((card) => (
							<div key={card.key} className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
								<p className="text-xs uppercase tracking-[0.25em] text-white/45">{card.label}</p>
								<p className="mt-3 text-3xl font-semibold">{loading ? '—' : stats?.[card.key] ?? 0}</p>
							</div>
						))}
					</div>

					<div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/50 p-6">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<h3 className="text-lg font-semibold">Project selector</h3>
								<p className="mt-1 text-sm text-white/65">Choose a project to inspect its task board.</p>
							</div>
							{selectedProject ? (
								<p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{selectedProject.title}</p>
							) : null}
						</div>

						{projectsError ? (
							<div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
								{projectsError}
							</div>
						) : null}

						<div className="mt-4 flex flex-wrap gap-3">
							{projectsLoading ? (
								<div className="text-sm text-white/55">Loading projects...</div>
							) : projects.length ? (
								projects.map((project) => (
									<button
										key={project._id}
										type="button"
										onClick={() => setSelectedProjectId(project._id)}
										className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
											selectedProjectId === project._id
												? 'border-cyan-300 bg-cyan-300 text-slate-950'
												: 'border-white/10 bg-white/5 text-white hover:bg-white/10'
										}`}
									>
										{project.title}
									</button>
								))
							) : (
								<div className="text-sm text-white/55">No projects yet. Create one from the Projects page.</div>
							)}
						</div>
					</div>

					<div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/50 p-6">
						<h3 className="text-lg font-semibold">Next step</h3>
						<p className="mt-2 text-sm leading-6 text-white/65">
							Open Projects to create a workspace, then drill into tasks from the selected Kanban board.
						</p>
					</div>

					<div className="mt-8">
						{selectedProjectId ? (
							<KanbanBoard projectId={selectedProjectId} />
						) : (
							<div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-8 text-sm text-white/60">
								Select a project above to load its task board.
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
