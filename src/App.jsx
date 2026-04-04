import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeContext';
import Analytics from './components/Analytics';
import PageTransition from './components/PageTransition';

import FeedbackForm from './components/FeedbackForm';
import ChatBot from './components/ChatBot';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const DeviceListing = lazy(() => import('./pages/DeviceListing'));
const DeviceDetails = lazy(() => import('./pages/DeviceDetails'));
const Compare = lazy(() => import('./pages/Compare'));
const News = lazy(() => import('./pages/News'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminAuth = lazy(() => import('./pages/AdminLogin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900 lg:bg-gradient-to-br lg:from-gray-50 lg:via-white lg:to-gray-100">
            {/* Fixed background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-[#0B3D91]/20 to-slate-900 dark:from-slate-950 dark:via-[#0B3D91]/20 dark:to-slate-900 pointer-events-none -z-10" />
            
            <Navbar />
            <Analytics />
            <main className="flex-1 relative z-0">
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/devices" element={<DeviceListing />} />
                    <Route path="/devices/:id" element={<DeviceDetails />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/admin-login" element={<AdminAuth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/*" 
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Suspense>
              </PageTransition>
            </main>
            <FeedbackForm />
            <ChatBot />
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
