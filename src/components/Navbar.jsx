import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MonitorSmartphone, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setIsMenuOpen(false);
      navigate(`/devices?search=${encodeURIComponent(q)}`);
    }
  };

  const menuLinks = [
    { name: 'Smartphones', to: '/devices?category=Smartphones' },
    { name: 'Tablets', to: '/devices?category=Tablets' },
    { name: 'Laptops', to: '/devices?category=Laptops' },
    { name: 'News', href: '/#news-feed' },
    { name: 'Compare', to: '/compare' },
  ];

  const isAdmin = profile?.role === 'admin';
  const avatar = profile?.avatar_url || null;

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 group">
              <MonitorSmartphone className="w-8 h-8 text-[var(--color-brand-accent)] group-hover:scale-110 transition-transform duration-300" />
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-[var(--color-brand-accent)] transition-colors">DevX</span>
            </Link>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6 lg:space-x-8">
              {menuLinks.map((link) => (
                link.to ? (
                  <Link key={link.name} to={link.to} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-white/5 border border-transparent hover:border-white/10">{link.name}</Link>
                ) : (
                  <a key={link.name} href={link.href} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-white/5 border border-transparent hover:border-white/10">{link.name}</a>
                )
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* ── Search Bar ── */}
            <form onSubmit={handleSearch} className="relative group hidden sm:block">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs..." 
                className="bg-white/5 border border-white/10 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:bg-white/10 text-white placeholder-gray-400 w-32 lg:w-48 transition-all group-hover:w-64 focus:w-64"
              />
              <button
                type="submit"
                className="absolute left-3 top-2.5 p-0 bg-transparent border-none cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </form>

            {user ? (
               <div className="flex items-center space-x-2 sm:space-x-3">
                 <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 hover:border-blue-500/50 transition-colors flex items-center justify-center shadow-lg" title="My Profile">
                   {avatar ? (
                     <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-5 h-5 text-gray-400" />
                   )}
                 </Link>
                 {isAdmin && (
                   <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="hidden md:flex items-center space-x-2 px-3 lg:px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all font-bold text-[10px] lg:text-xs tracking-widest shadow-lg" title="Admin Dashboard">
                     <Settings size={14} />
                     <span>ADMIN</span>
                   </Link>
                 )}
                 {isAdmin && (
                   <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="md:hidden w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/50 hover:text-white transition-colors shadow-lg" title="Admin Dashboard">
                     <Settings size={18} />
                   </Link>
                 )}
                 <button onClick={handleSignOut} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/30 hover:text-white flex items-center justify-center transition-colors shadow-lg" title="Sign Out">
                   <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                 </button>
               </div>
             ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Link to="/admin-login" onClick={() => setIsMenuOpen(false)} className="hidden xs:flex text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest px-2 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                    Admin
                  </Link>
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)} className="text-xs font-semibold text-gray-300 hover:text-white transition-colors uppercase tracking-wide">Sign In</Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--color-brand-accent)] hover:bg-blue-400 text-white rounded-lg transition-colors uppercase tracking-wide">Sign Up</Link>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-[-1] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-16 inset-x-0 bg-[#0f172a] border-b border-white/10 shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col p-6 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative sm:hidden mb-4">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs..." 
                className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </form>

            {menuLinks.map((link) => (
              link.to ? (
                <Link 
                  key={link.name} 
                  to={link.to} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-gray-300 hover:text-blue-400 transition-colors py-2 border-b border-white/5 last:border-0"
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-gray-300 hover:text-blue-400 transition-colors py-2 border-b border-white/5 last:border-0"
                >
                  {link.name}
                </a>
              )
            ))}
            
            {!user && (
              <div className="flex flex-col pt-4 gap-3 border-t border-white/10">
                <Link to="/signin" onClick={() => setIsMenuOpen(false)} className="text-center py-3 rounded-xl bg-white/5 text-white font-bold tracking-widest uppercase text-xs">Sign In</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-center py-3 rounded-xl bg-blue-600 text-white font-bold tracking-widest uppercase text-xs">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
