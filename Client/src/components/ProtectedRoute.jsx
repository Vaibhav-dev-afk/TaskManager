import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function ProtectedRoute() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}
