import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Layout() {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <aside className="w-64 bg-slate-950 p-6 flex flex-col border-r border-white/10">
                <h2 className="text-xl font-bold mb-8 tracking-widest uppercase text-cyan-400">TaskManager</h2>
                <nav className="flex flex-col gap-4 flex-grow">
                    <Link to="/dashboard" className={`transition ${isActive('/dashboard') ? 'text-cyan-400' : 'hover:text-cyan-200'}`}>Dashboard</Link>
                    <Link to="/projects" className={`transition ${isActive('/projects') ? 'text-cyan-400' : 'hover:text-cyan-200'}`}>Projects</Link>
                    <Link to="/profile" className={`transition ${isActive('/profile') ? 'text-cyan-400' : 'hover:text-cyan-200'}`}>Profile</Link>
                </nav>
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="truncate text-sm font-medium">{user?.name}</span>
                    </div>
                    <button onClick={handleLogout} className="text-rose-400 hover:text-rose-300 transition text-sm">
                        Exit
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}