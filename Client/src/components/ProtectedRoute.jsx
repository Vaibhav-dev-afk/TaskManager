import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
                <p>Loading workspace...</p>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}