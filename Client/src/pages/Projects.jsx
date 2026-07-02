export default function Projects() {
	return (
		<div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
			<div className="mx-auto max-w-6xl space-y-6">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
					<h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
					<p className="mt-2 text-sm text-white/65">Create and manage project spaces for your team.</p>

					<form className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5" onSubmit={handleSubmit(onCreateProject)}>
						<div className="grid gap-4 md:grid-cols-[1fr_2fr_auto]">
							<div>
								<label className="mb-2 block text-sm font-medium text-white/80" htmlFor="title">
									Project name
								</label>
								<input
									id="title"
									placeholder="Website launch"
									className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400"
									{...register('title', { required: 'Project name is required' })}
								/>
								{errors.title ? <p className="mt-2 text-sm text-rose-300">{errors.title.message}</p> : null}
							</div>
							<div>
								<label className="mb-2 block text-sm font-medium text-white/80" htmlFor="description">
									Description
								</label>
								<input
									id="description"
									placeholder="Short project summary"
									className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-400"
									{...register('description')}
								/>
							</div>
							<div className="flex items-end">
								<button type="submit" className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
									Create
								</button>
							</div>
						</div>
						{actionError ? <p className="text-sm text-rose-300">{actionError}</p> : null}
						{actionMessage ? <p className="text-sm text-emerald-300">{actionMessage}</p> : null}
					</form>
				</div>

				{error ? (
					<div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 px-6 py-4 text-sm text-rose-200">
						{error}
					</div>
				) : null}

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{loading
						? [1, 2, 3].map((item) => (
							<div key={item} className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
						))
						: sortedProjects.map((project) => (
							<div key={project._id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
								<div className="flex items-start justify-between gap-4">
									<div>
										<h2 className="text-xl font-semibold">{project.title}</h2>
										<p className="mt-2 text-sm leading-6 text-white/65">
											{project.description || 'No description provided.'}
										</p>
									</div>
									<span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50">
										{project.members?.length || 0} members
									</span>
								</div>
								<div className="mt-5 text-xs text-white/45">
									Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'recently'}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
