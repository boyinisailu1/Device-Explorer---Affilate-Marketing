import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Lock, Mail } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: signinError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signinError) {
        if (signinError.message === 'Email not confirmed') {
             setError('Please check your mailbox. We have sent you a verification email to your email. Please verify it and login again.');
        } else {
             setError(signinError.message);
        }
    } else {
      // Logic for admin vs user. If they hit the admin login route or have admin email
      if (['admin@devx.com', 'sayiluindia7@gmail.com'].includes(email) || window.location.pathname.includes('/admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full"></div>
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-extrabold mb-2 text-white">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600 font-medium"
                  placeholder="you@example.com"
                  required 
                />
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600 font-medium"
                  placeholder="••••••••"
                  required 
                />
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 rounded-xl font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
            >
              {loading ? 'Signing in...' : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-400 text-sm">Don't have an account? </span>
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
