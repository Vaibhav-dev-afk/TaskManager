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

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: '', email: '', password: '' },
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
            setServerError(error?.response?.data?.message || 'Authentication failed.');
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
        <div className="flex h-screen items-center justify-center bg-slate-950 px-6">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-1">
                    <button type="button" onClick={() => switchMode('login')} className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${mode === 'login' ? 'bg-white text-slate-950' : 'text-white/70 hover:text-white'}`}>Login</button>
                    <button type="button" onClick={() => switchMode('register')} className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${mode === 'register' ? 'bg-white text-slate-950' : 'text-white/70 hover:text-white'}`}>Register</button>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {mode === 'register' && (
                        <div>
                            <input id="name" placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400" {...register('name', { required: mode === 'register' ? 'Name is required' : false })} />
                            {errors.name && <p className="mt-2 text-sm text-rose-300">{errors.name.message}</p>}
                        </div>
                    )}
                    <div>
                        <input id="email" type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400" {...register('email', { required: 'Email is required' })} />
                        {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p>}
                    </div>
                    <div>
                        <input id="password" type="password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400" {...register('password', { required: 'Password is required' })} />
                        {errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p>}
                    </div>
                    {serverError && <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{serverError}</div>}
                    <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-70">
                        {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;