import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Layout() {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <aside className="w-64 bg-slate-950 p-6 flex flex-col border-r border-white/10">
                <h2 className="text-xl font-bold mb-8 tracking-widest uppercase text-cyan-400">TaskManager</h2>
                <nav className="flex flex-col gap-4 flex-grow">
                    <Link to="/dashboard" className={`transition ${isActive('/dashboard') ? 'text-cyan-400' : 'hover:text-cyan-200'}`}>Dashboard</Link>
                    <Link to="/projects" className={`transition ${isActive('/projects') ? 'text-cyan-400' : 'hover:text-cyan-200'}`}>Projects</Link>
                </nav>
                <button onClick={handleLogout} className="text-left text-rose-400 hover:text-rose-300 transition mt-auto">
                    Sign Out
                </button>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}