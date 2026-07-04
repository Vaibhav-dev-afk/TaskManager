import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    // Grab the loading state from your store
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth); 

    // 1. If we are currently asking the backend about the cookie, WAIT.
    if (isCheckingAuth) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <p>Loading workspace...</p>
            </div>
        );
    }

    // 2. Once the check is done, make the decision to let them in or kick them out.
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}