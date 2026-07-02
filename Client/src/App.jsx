import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/useAuthStore';

export default function App() {
	const checkSession = useAuthStore((state) => state.checkSession);

	useEffect(() => {
		checkSession();
	}, [checkSession]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/auth" element={<Auth />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/projects" element={<Projects />} />
				</Route>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
