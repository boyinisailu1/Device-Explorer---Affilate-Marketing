import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-16 px-4">Loading backend profile...</div>;
  }
  
  if (!user || (adminOnly && profile?.role !== 'admin')) {
    return <Navigate to={adminOnly ? "/admin-login" : "/signin"} replace />;
  }
  return children;
}
