import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Shuffle, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [sessionLoading, setSessionLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Check initial session
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
        setSessionLoading(false);
      } else {
        // If not immediately available, give it a moment to parse the hash
        setTimeout(async () => {
          const { data: { session: delayedSession } } = await supabase.auth.getSession();
          setHasSession(!!delayedSession);
          setSessionLoading(false);
        }, 1500);
      }
    };

    checkInitialSession();

    // Listen for auth state changes specifically for the recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasSession(true);
        setSessionLoading(false);
      } else if (session) {
        setHasSession(true);
        setSessionLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      // Wait 3 seconds then redirect to login
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-[#0B0F19]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-black mb-2 text-white tracking-tight">Set New Password</h2>
            <p className="text-gray-400 font-medium">Create a strong, secure password for your account.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {sessionLoading ? (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <Loader className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
              <p className="text-gray-400 font-medium">Verifying your secure link...</p>
            </div>
          ) : !hasSession ? (
            <div className="text-center py-8 space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Reset Link Expired</h3>
                <p className="text-gray-400">This password reset link is invalid or has already been used.</p>
              </div>
              <Link 
                to="/forgot-password" 
                className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all text-center shadow-lg shadow-blue-900/20"
              >
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center space-y-6 py-8">
              <div className="flex justify-center">
                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Password Updated!</h3>
              <p className="text-gray-400">Your credentials have been updated. Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-5 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 text-left block">New Password</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600 font-bold"
                    placeholder="••••••••"
                    required 
                  />
                  <Lock className="absolute left-4 top-4.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 text-left block">Confirm New Password</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600 font-bold"
                    placeholder="••••••••"
                    required 
                  />
                  <Shuffle className="absolute left-4 top-4.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-2xl font-black text-white shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-4"
              >
                {loading ? 'Updating...' : (
                  <>
                    <span>Update Credentials</span>
                    <Save size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center mt-12 text-gray-500 text-[10px] font-black uppercase tracking-widest">
            DevX Identity Service • Secure Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
