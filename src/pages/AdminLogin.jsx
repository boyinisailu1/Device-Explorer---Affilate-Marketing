import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, User, Mail, ShieldCheck, ArrowRight, Loader } from 'lucide-react';

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'admin' // Force role to admin for anybody signing up through this panel
            }
          }
        });
        if (signUpError) throw signUpError;
        alert('Admin registration successful! You can now log in.');
        setIsLogin(true);
        setLoading(false);
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 bg-[#0B0F19]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-black mb-2 text-white tracking-tight">
              {isLogin ? 'Admin Access' : 'Create Admin ID'}
            </h2>
            <p className="text-gray-400 font-medium">
              {isLogin ? 'Secure gateway for DevX moderators' : 'Register as a system administrator'}
            </p>
          </div>

          <div className="flex p-1 bg-white/5 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Full Name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 border-none transition-all placeholder-gray-600 font-bold"
                    placeholder="E.g. John Doe"
                    required 
                  />
                  <User className="absolute left-4 top-4.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600 font-bold"
                  placeholder="admin@devx.com"
                  required 
                />
                <Mail className="absolute left-4 top-4.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Master Password</label>
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
              {isLogin && (
                <div className="flex justify-end mt-2 px-1">
                  <Link to="/forgot-password" weight="bold" className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors">
                    Reset Password?
                  </Link>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-2xl font-black text-white shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin" /> : (
                <>
                  <span>{isLogin ? 'Secure Login' : 'Create Admin Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-xs font-bold uppercase tracking-tighter">
            Internal Use Only • Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
