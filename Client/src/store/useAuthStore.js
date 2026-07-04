import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    login: (userData) => set({ user: userData, isAuthenticated: true }),
    logout: async () => {
        try {
            await api.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            console.error(error);
        }
    },
    checkAuth: async () => {
        try {
            const response = await api.get('/users/me');
            set({ user: response.data, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, isCheckingAuth: false });
        }
    }
}));

export default useAuthStore;
