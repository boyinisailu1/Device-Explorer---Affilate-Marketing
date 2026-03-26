import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import { Smartphone, Tablet, Laptop, Watch, Headphones } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DeviceCard from '../components/DeviceCard';
import HeroBackground from '../components/HeroBackground';
import NewsFeed from '../components/NewsFeed';

export default function Home() {
  const categories = [
    { name: 'Smartphones', icon: Smartphone, color: 'text-blue-500' },
    { name: 'Tablets', icon: Tablet, color: 'text-purple-500' },
    { name: 'Laptops', icon: Laptop, color: 'text-green-500' },
    { name: 'Watches', icon: Watch, color: 'text-rose-500' },
    { name: 'Audio', icon: Headphones, color: 'text-yellow-500' },
  ];

  const [featuredDevices, setFeaturedDevices] = useState([]);

  useEffect(() => {
    supabase.from('devices').select('*').limit(3).then(({ data }) => setFeaturedDevices(data || []));
  }, []);

  return (
    <div className="pt-20 pb-16 relative overflow-hidden min-h-screen flex flex-col justify-center animate-page-fade-in">
      <HeroBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="flex flex-col-reverse lg:flex-row gap-12 items-center mb-32 min-h-[60vh]">
          <div className="flex-1 space-y-8 hero-text z-10 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight pt-10 lg:pt-0">
              Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">smarter.</span><br />
              Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">faster.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0">
              Explore devices, understand features, and make the right decision in seconds.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Link to="/devices" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full font-bold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow text-center">
                Explore Devices
              </Link>
              <Link to="/compare" className="px-8 py-4 glass rounded-full font-bold text-white glass-hover transition-all text-center">
                Compare Devices
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative h-[400px] lg:h-[500px]">
            <Hero3D />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Browse Categories</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/devices?category=${cat.name}`} className="glass relative overflow-hidden glass-hover p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 aspect-square transition-all group shadow-lg">
                <div className={`p-5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors shadow-inner ${cat.color}`}>
                  <cat.icon size={40} />
                </div>
                <span className="font-semibold text-lg text-gray-200 group-hover:text-white transition-colors">{cat.name}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Devices */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold">Latest Devices</h2>
            <Link to="/devices" className="text-[var(--color-brand-accent)] hover:underline font-semibold">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>

        {/* Device News Feed */}
        <NewsFeed />

      </div>
    </div>
  );
}
