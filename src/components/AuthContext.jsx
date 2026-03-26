/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionUser) => {
    if (!sessionUser) {
      setProfile(null);
      return;
    }
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).maybeSingle();
    
    if (profileData) {
      setProfile(profileData);
    } else {
      // If profile doesn't exist, create it. Use role from metadata if available (for admin registration)
      const role = sessionUser.user_metadata?.role || (['admin@devx.com', 'sayiluindia7@gmail.com'].includes(sessionUser.email) ? 'admin' : 'user');
      const { data: newProfile, error: upsertError } = await supabase.from('profiles').upsert({ 
        id: sessionUser.id, 
        role,
        name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || '',
        avatar_url: sessionUser.user_metadata?.avatar_url || ''
      }).select().maybeSingle();
      
      if (!upsertError && newProfile) setProfile(newProfile);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchProfile(u).then(() => setLoading(false));
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchProfile(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
