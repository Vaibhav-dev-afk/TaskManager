import { useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

export default function Profile() {
    const { user, checkAuth } = useAuthStore();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            await checkAuth();
            setFile(null);
        } catch (error) {
            alert('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/users/profile', { name, bio });
            await checkAuth();
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 mt-10">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                <div className="flex items-center gap-6 mb-8">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <form onSubmit={handleUpload} className="flex flex-col gap-2">
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:bg-white/10 file:text-white" required />
                        <button type="submit" disabled={isUploading || !file} className="bg-cyan-500 text-slate-950 px-4 py-1 rounded-xl font-semibold w-fit disabled:opacity-50 text-sm">
                            {isUploading ? 'Uploading...' : 'Update Picture'}
                        </button>
                    </form>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/70 mb-1">Display Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-cyan-400" required />
                    </div>
                    <div>
                        <label className="block text-sm text-white/70 mb-1">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-cyan-400" rows="3" placeholder="Tell your team about yourself..."></textarea>
                    </div>
                    <button type="submit" disabled={isSaving} className="bg-white text-slate-950 px-6 py-2 rounded-xl font-semibold hover:bg-slate-200 transition disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}