import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	login: (user) => set({ user, isAuthenticated: true }),
	logout: () => set({ user: null, isAuthenticated: false }),
	checkSession: async () => {
		try {
			const response = await api.get('/users/me');
			set({ user: response.data, isAuthenticated: true });
			return response.data;
		} catch (error) {
			set({ user: null, isAuthenticated: false });
			return null;
		}
	},
}));

export default useAuthStore;
