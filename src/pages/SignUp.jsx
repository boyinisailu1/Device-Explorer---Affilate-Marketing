import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, UserPlus, CheckCircle } from 'lucide-react';
import { validateEmail } from '../lib/validation';
import { handleSupabaseError, logError } from '../lib/errorHandler';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    setValidationError(null);
    
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setValidationError('Password is required');
      return false;
    }
    
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return false;
    }
    
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        const errorInfo = handleSupabaseError(signupError);
        setError(errorInfo.message);
        logError(signupError, { context: 'signup', email });
      } else {
        setSuccess(true);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      logError(err, { context: 'signup_exception', email });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="w-full max-w-md">
          <div className="glass p-10 rounded-3xl border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)] text-center relative overflow-hidden">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold mb-4 text-white">Check Your Mailbox</h2>
            <p className="text-gray-300 font-medium mb-8 leading-relaxed">
              We have sent you a verification email to your email. Please verify it.
            </p>
            <Link 
              to="/signin" 
              className="inline-block w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-xl font-bold text-white shadow-lg transition-all"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full"></div>
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-extrabold mb-2 text-white">Create Account</h2>
            <p className="text-gray-400">Join DevX and start exploring</p>
          </div>

          {(error || validationError) && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium text-center">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6 relative z-10">
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
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 rounded-xl font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
            >
              {loading ? 'Creating...' : (
                <>
                  <UserPlus size={20} />
                  <span>Sign Up</span>
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-400 text-sm">Already have an account? </span>
              <Link to="/signin" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
