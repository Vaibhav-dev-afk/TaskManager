import { useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

export default function Profile() {
    const { user, checkAuth } = useAuthStore();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await api.post('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await checkAuth();
            setFile(null);
        } catch (error) {
            console.error(error);
            alert('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-8 rounded-3xl mt-10">
            <h1 className="text-3xl font-bold mb-8">Profile</h1>
            <div className="flex items-center gap-6 mb-10">
                {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="text-2xl font-semibold">{user?.name}</p>
                    <p className="text-white/60">{user?.email}</p>
                </div>
            </div>
            <form onSubmit={handleUpload} className="flex flex-col gap-4 items-start">
                <label className="block text-sm font-medium text-white/80">Upload New Avatar</label>
                <div className="flex gap-4 w-full">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        className="flex-1 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 transition" 
                        required 
                    />
                    <button 
                        type="submit" 
                        disabled={isUploading || !file} 
                        className="bg-white text-slate-950 px-6 py-2 rounded-xl font-semibold transition hover:bg-slate-200 disabled:opacity-50"
                    >
                        {isUploading ? 'Uploading...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}