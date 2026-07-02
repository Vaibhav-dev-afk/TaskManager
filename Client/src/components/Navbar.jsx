import useAuthStore from '../store/useAuthStore';

export default function Navbar() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);

	return (
		<header className="border-b border-white/10 bg-slate-950/80 px-6 py-4 text-white backdrop-blur">
			<div className="mx-auto flex max-w-7xl items-center justify-between">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-cyan-300">TaskManager</p>
					<h1 className="text-lg font-semibold">Dashboard</h1>
				</div>
				<div className="flex items-center gap-3">
					{user ? (
						<div className="text-right">
							<p className="text-sm font-medium text-white">{user.name}</p>
							<p className="text-xs text-white/55">{user.email}</p>
						</div>
					) : null}
					<button
						type="button"
						onClick={logout}
						className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
					>
						Sign out
					</button>
				</div>
			</div>
		</header>
	);
}
