import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      if (resetError.message.includes('rate limit')) {
        setError('Email rate limit exceeded. Please wait a few minutes or adjust your Supabase rate limits in the dashboard.');
      } else {
        setError(resetError.message);
      }
    } else {
      setMessage('Password reset link has been sent to your email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-[#0B0F19]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <Link 
            to="/signin" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-black mb-2 text-white tracking-tight">Recover Password</h2>
            <p className="text-gray-400 font-medium">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {message ? (
            <div className="text-center space-y-6 py-8">
              <div className="flex justify-center">
                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <p className="text-white font-bold leading-relaxed">{message}</p>
              <p className="text-gray-500 text-sm">Please check your inbox (and spam folder) for the reset link.</p>
              <Link 
                to="/signin" 
                className="block w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all text-center border border-white/10"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 text-left block">Email Address</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600 font-bold"
                    placeholder="you@example.com"
                    required 
                  />
                  <Mail className="absolute left-4 top-4.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-2xl font-black text-white shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Sending...' : (
                  <>
                    <span>Send Reset Link</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center mt-12 text-gray-500 text-[10px] font-black uppercase tracking-widest">
            DevX Identity Service • Secure Access
          </p>
        </div>
      </div>
    </div>
  );
}
