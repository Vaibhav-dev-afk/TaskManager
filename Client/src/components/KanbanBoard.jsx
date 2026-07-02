import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';

const STATUS_COLUMNS = [
	{ key: 'to-do', label: 'todo' },
	{ key: 'inprogress', label: 'inprogress' },
	{ key: 'completed', label: 'done' },
];

const PRIORITY_STYLES = {
	low: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
	medium: 'bg-amber-100 text-amber-700 ring-amber-200',
	high: 'bg-rose-100 text-rose-700 ring-rose-200',
};

const STATUS_LABELS = {
	'to-do': 'To do',
	inprogress: 'In progress',
	completed: 'Done',
};

export default function KanbanBoard({ projectId }) {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!projectId) {
			setTasks([]);
			setLoading(false);
			setError('Project ID is required.');
			return;
		}

		let mounted = true;

		const fetchTasks = async () => {
			try {
				setLoading(true);
				setError('');
				const { data } = await api.get(`/tasks/project/${projectId}`);
				if (mounted) setTasks(Array.isArray(data) ? data : data?.tasks || []);
			} catch (err) {
				if (mounted) setError(err?.response?.data?.message || 'Failed to load tasks.');
			} finally {
				if (mounted) setLoading(false);
			}
		};

		fetchTasks();

		const socket = io('http://localhost:3000', { withCredentials: true });
		socket.emit('joinProject', projectId);
		socket.on('taskUpdated', (updatedTask) => {
			if (!mounted) return;
			setTasks((currentTasks) => currentTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
		});
		socket.on('taskCreated', (createdTask) => {
			if (!mounted) return;
			setTasks((currentTasks) => [createdTask, ...currentTasks]);
		});
		socket.on('taskDeleted', ({ taskId }) => {
			if (!mounted) return;
			setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
		});

		return () => {
			mounted = false;
			socket.disconnect();
		};
	}, [projectId]);

	const tasksByStatus = useMemo(
		() =>
			STATUS_COLUMNS.reduce((acc, column) => {
				acc[column.key] = tasks.filter((task) => task.status === column.key);
				return acc;
			}, {}),
		[tasks]
	);

	const formatDate = (date) => {
		if (!date) return 'No due date';
		const parsed = new Date(date);
		return Number.isNaN(parsed.getTime()) ? 'No due date' : parsed.toLocaleDateString();
	};

	return (
		<div className="w-full rounded-2xl bg-slate-50 p-4 sm:p-6">
			<div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight text-slate-900">Kanban Board</h2>
					<p className="text-sm text-slate-500">Organize tasks by progress and priority.</p>
				</div>
			</div>

			{error ? (
				<div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
					{error}
				</div>
			) : null}

			{loading ? (
				<div className="grid gap-4 md:grid-cols-3">
					{STATUS_COLUMNS.map((column) => (
						<div key={column.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<div className="mb-4 h-6 w-28 animate-pulse rounded bg-slate-200" />
							<div className="space-y-3">
								{[1, 2, 3].map((item) => (
									<div key={item} className="h-28 animate-pulse rounded-xl bg-slate-100" />
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-3">
					{STATUS_COLUMNS.map((column) => (
						<section
							key={column.key}
							className="flex min-h-[20rem] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm"
						>
							<div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
								<h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
									{column.label}
								</h3>
								<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
									{tasksByStatus[column.key]?.length || 0}
								</span>
							</div>

							<div className="flex-1 space-y-3 overflow-y-auto p-4">
								{tasksByStatus[column.key]?.length ? (
									tasksByStatus[column.key].map((task) => {
										const priorityClass = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

										return (
											<article
												key={task._id}
												className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
											>
												<div className="mb-3 flex items-start justify-between gap-3">
													<div>
														<h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
														{task.description ? (
															<p className="mt-1 line-clamp-3 text-sm text-slate-600">{task.description}</p>
														) : null}
													</div>
												</div>

												<div className="flex flex-wrap items-center gap-2">
													<span
														className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityClass}`}
													>
														{task.priority || 'medium'} priority
													</span>
													<span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
														{STATUS_LABELS[task.status] || task.status}
													</span>
												</div>

												<div className="mt-4 flex items-center justify-between text-xs text-slate-500">
													<span>{formatDate(task.duedate)}</span>
													{task.assignedTo ? <span>Assigned</span> : <span>Unassigned</span>}
												</div>
											</article>
										);
									})
								) : (
									<div className="flex h-full min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
										No tasks here.
									</div>
								)}
							</div>
						</section>
					))}
				</div>
			)}
		</div>
	);
}
