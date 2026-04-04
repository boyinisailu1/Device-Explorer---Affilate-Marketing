import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import { supabase } from '../lib/supabase';
import DeviceCard from '../components/DeviceCard';
import HeroBackground from '../components/HeroBackground';
import TrustSignals from '../components/TrustSignals';
import ComparisonCTA from '../components/ComparisonCTA';

// Import category images from assets
import phoneImg from '../assets/phone.jpg';
import tabletImg from '../assets/Tablet.jpg';
import laptopImg from '../assets/laptop.jpg';
import watchImg from '../assets/Watch.jpg';
import audioImg from '../assets/Audio.jpg';

export default function Home() {
  const categories = [
    { name: 'Smartphones', image: phoneImg },
    { name: 'Tablets', image: tabletImg },
    { name: 'Laptops', image: laptopImg },
    { name: 'Watches', image: watchImg },
    { name: 'Audio', image: audioImg },
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
              <Link key={cat.name} to={`/devices?category=${cat.name}`} className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer h-48 lg:h-56 flex flex-col">
                {/* Background Image */}
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-300"
                />
                
                {/* Dark Overlay - stronger at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70 group-hover:from-black/10 group-hover:via-black/20 group-hover:to-black/60 transition-all duration-300" />
                
                {/* Category Name - at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center">
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-sm lg:text-base hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all transform group-hover:scale-105 border border-blue-400/50">
                    {cat.name}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Devices */}
        <div className="mb-24">
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
      </div>

      {/* Trust Signals Section */}
      <TrustSignals />

      {/* Comparison CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ComparisonCTA />
      </div>
    </div>
  );
}
