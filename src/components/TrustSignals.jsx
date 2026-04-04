import { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle, Zap, Edit2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const DEFAULT_STATS = [
  { 
    id: 'devices_indexed',
    icon: TrendingUp, 
    label: 'Devices Indexed',
    value: '5,000+',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'active_users',
    icon: Users, 
    label: 'Active Users',
    value: '50K+',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'verified_specs',
    icon: CheckCircle, 
    label: 'Verified Specs',
    value: '100%',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'comparisons_made',
    icon: Zap, 
    label: 'Comparisons Made',
    value: '500K+',
    color: 'from-orange-500 to-red-500'
  },
];

export default function TrustSignals() {
  const { user } = useAuth();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Only allow editing for specific email
  const isEditingAllowed = user?.email === 'sayiluindia7@gmail.com';

  // Load stats from Supabase on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

      if (data) {
        // Merge with defaults
        const updatedStats = DEFAULT_STATS.map(stat => ({
          ...stat,
          value: data[stat.id] || stat.value
        }));
        setStats(updatedStats);
      }
    } catch (err) {
      console.log('Using default stats:', err);
      setStats(DEFAULT_STATS);
    }
  };

  const handleEditStart = () => {
    const values = {};
    stats.forEach(stat => {
      values[stat.id] = stat.value;
    });
    setEditValues(values);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get existing data
      const { data: existing } = await supabase
        .from('site_stats')
        .select('id')
        .single();

      const statData = {};
      stats.forEach(stat => {
        statData[stat.id] = editValues[stat.id] || stat.value;
      });

      if (existing?.id) {
        // Update
        await supabase
          .from('site_stats')
          .update(statData)
          .eq('id', existing.id);
      } else {
        // Insert
        await supabase
          .from('site_stats')
          .insert([statData]);
      }

      // Update local state
      const updatedStats = stats.map(stat => ({
        ...stat,
        value: editValues[stat.id] || stat.value
      }));
      setStats(updatedStats);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save stats:', err);
      alert('Error saving stats. Check console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by Tech Enthusiasts</h2>
            {isEditingAllowed && !isEditing && (
              <button
                onClick={handleEditStart}
                className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition-all"
                title="Edit stats"
              >
                <Edit2 size={20} />
              </button>
            )}
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">Join thousands of users making smarter device decisions every day</p>
        </div>

        {isEditing ? (
          // Edit Mode
          <div className="glass rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">📝 Edit Trust Stats</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {stats.map((stat) => (
                <div key={stat.id} className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {stat.label}
                  </label>
                  <input
                    type="text"
                    value={editValues[stat.id] || stat.value}
                    onChange={(e) => setEditValues(prev => ({
                      ...prev,
                      [stat.id]: e.target.value
                    }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 5,000+ or 100%"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="glass rounded-2xl p-6 glass-hover border border-white/10 group relative overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Glow effect */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
