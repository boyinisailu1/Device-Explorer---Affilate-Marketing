import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import { User, Camera, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function Profile() {
  const { user, profile, setProfile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true);
      setError(null);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err) {
      setError('Error uploading avatar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, name, avatar_url: avatarUrl })
        .select()
        .maybeSingle();

      if (updateError) throw updateError;
      if (!data) throw new Error('No profile record found to update.');
      setProfile(data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
        
        <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
          {/* Avatar Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative group">
              <div className="w-48 h-48 rounded-full bg-white/5 border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-2xl transition-all group-hover:border-blue-500/50">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={80} className="text-gray-500" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-3 bg-blue-600 hover:bg-blue-500 rounded-full cursor-pointer shadow-xl transition-all hover:scale-110">
                <Camera size={20} className="text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <p className="mt-4 text-xs text-gray-400 text-center uppercase tracking-widest font-bold">
              {profile?.role === 'admin' ? 'Administrator' : 'Verified User'}
            </p>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">My Profile</h1>
              <p className="text-gray-400">Update your details and avatar logo.</p>
            </div>

            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm font-medium flex items-center gap-3">
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium flex items-center gap-3">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2 opacity-60">
                <label className="text-sm font-medium text-gray-400">Email Address (Primary)</label>
                <input 
                  type="email" 
                  value={user?.email}
                  disabled
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || uploading}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
