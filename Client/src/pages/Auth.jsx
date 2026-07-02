import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const Auth = () => {
	const [mode, setMode] = useState('login');
	const [serverError, setServerError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values) => {
		setServerError('');
		setIsSubmitting(true);

		try {
			if (mode === 'register') {
				await api.post('/auth/register', {
					name: values.name,
					email: values.email,
					password: values.password,
				});

				const loginResponse = await api.post('/auth/login', {
					email: values.email,
					password: values.password,
				});

				login(loginResponse.data.user);
				navigate('/dashboard');
				return;
			}

			const response = await api.post('/auth/login', {
				email: values.email,
				password: values.password,
			});

			login(response.data.user);
			navigate('/dashboard');
		} catch (error) {
			setServerError(
				error?.response?.data?.message || 'Authentication failed. Please try again.',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const switchMode = (nextMode) => {
		setMode(nextMode);
		setServerError('');
		reset({ name: '', email: '', password: '' });
	};

	return (
		<div className="min-h-screen bg-slate-950 text-white">
			<div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
				<section className="relative flex items-end overflow-hidden bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-950 px-8 py-12 sm:px-12 lg:px-16">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_28%)]" />
					<div className="relative z-10 max-w-xl">
						<p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
							TaskManager Pro
						</p>
						<h1 className="max-w-lg text-4xl font-semibold leading-tight sm:text-5xl">
							Organize projects, tasks, and teams in one focused workspace.
						</h1>
						<p className="mt-6 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
							Track delivery, assign work, and keep your team aligned with a clean dashboard built for momentum.
						</p>
						<div className="mt-10 grid gap-4 sm:grid-cols-3">
							{[
								['Projects', 'Plan work with clear ownership.'],
								['Tasks', 'Move fast with simple workflow states.'],
								['Teams', 'Invite people and stay in sync.'],
							].map(([title, copy]) => (
								<div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
									<p className="text-sm font-semibold text-white">{title}</p>
									<p className="mt-2 text-xs leading-5 text-white/70">{copy}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="flex items-center justify-center bg-slate-950 px-6 py-12 sm:px-10 lg:px-16">
					<div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
						<div className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-1">
							<button
								type="button"
								onClick={() => switchMode('login')}
								className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${mode === 'login' ? 'bg-white text-slate-950' : 'text-white/70 hover:text-white'}`}
							>
								Login
							</button>
							<button
								type="button"
								onClick={() => switchMode('register')}
								className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${mode === 'register' ? 'bg-white text-slate-950' : 'text-white/70 hover:text-white'}`}
							>
								Register
							</button>
						</div>

						<div className="mb-8">
							<h2 className="text-3xl font-semibold tracking-tight text-white">
								{mode === 'login' ? 'Welcome back' : 'Create your account'}
							</h2>
							<p className="mt-2 text-sm leading-6 text-white/65">
								{mode === 'login'
									? 'Sign in to continue managing your tasks and projects.'
									: 'Register once and start organizing your team immediately.'}
							</p>
						</div>

						<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
							{mode === 'register' && (
								<div>
									<label className="mb-2 block text-sm font-medium text-white/80" htmlFor="name">
										Name
									</label>
									<input
										id="name"
										autoComplete="name"
										placeholder="Your name"
										className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400 focus:bg-white/10"
										{...register('name', {
											required: mode === 'register' ? 'Name is required' : false,
											minLength: {
												value: 2,
												message: 'Name must be at least 2 characters',
											},
										})}
									/>
									{errors.name && <p className="mt-2 text-sm text-rose-300">{errors.name.message}</p>}
								</div>
							)}

							<div>
								<label className="mb-2 block text-sm font-medium text-white/80" htmlFor="email">
									Email
								</label>
								<input
									id="email"
									type="email"
									autoComplete="email"
									placeholder="you@example.com"
									className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400 focus:bg-white/10"
									{...register('email', {
										required: 'Email is required',
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: 'Enter a valid email address',
										},
									})}
								/>
								{errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p>}
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/80" htmlFor="password">
									Password
								</label>
								<input
									id="password"
									type="password"
									autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
									placeholder="Enter your password"
									className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400 focus:bg-white/10"
									{...register('password', {
										required: 'Password is required',
										minLength: {
											value: 6,
											message: 'Password must be at least 6 characters',
										},
									})}
								/>
								{errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p>}
							</div>

							{serverError && (
								<div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
									{serverError}
								</div>
							)}

							<button
								type="submit"
								disabled={isSubmitting}
								className="group inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
							>
								<span>{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</span>
								<span className="ml-2 transition group-hover:translate-x-0.5">→</span>
							</button>
						</form>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Auth;
