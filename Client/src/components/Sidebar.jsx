import useAuthStore from '../store/useAuthStore';

export default function Sidebar() {
	const user = useAuthStore((state) => state.user);

	return (
		<aside className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl">
			<h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Workspace</h2>
			<div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
				<p className="text-xs uppercase tracking-[0.25em] text-white/45">Current user</p>
				<p className="mt-2 text-sm font-semibold">{user?.name || 'Guest'}</p>
				<p className="text-xs text-white/60">{user?.email || 'No active session'}</p>
			</div>
			<div className="mt-4 space-y-3 text-sm text-white/70">
				<p>Overview</p>
				<p>Projects</p>
				<p>Tasks</p>
			</div>
		</aside>
	);
}
