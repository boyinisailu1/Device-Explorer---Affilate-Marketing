import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ExternalLink, Info } from 'lucide-react';

const subheadings = [
  "Compare Before You Buy – Make Every Rupee Count",
  "Find the Best Tech Deals from Top Brands in Seconds",
  "Your Next Device, Chosen the Right Way.",
  "Smart Comparisons. Faster Decisions. Better Tech.",
  "Unbiased Insights for Your Next Premium Tech Purchase.",
  "High-Performance Tech Meets Modern Shopping.",
  "Experience the Future of Device Comparison."
];

export default function AdSlot({ position }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subheading] = useState(() => subheadings[Math.floor(Math.random() * subheadings.length)]);

  useEffect(() => {
    async function fetchAd() {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        // Pick a random ad from the active results
        const randomIndex = Math.floor(Math.random() * data.length);
        setAd(data[randomIndex]);
      }
      setLoading(false);
    }
    fetchAd();
  }, [position]);

  if (loading || !ad) return null;

  const isHeader = position === 'header';

  return (
    <div className={`relative group ${isHeader ? 'mb-12' : 'h-full'}`}>
      <div className={`glass rounded-2xl border border-white/10 overflow-hidden relative transition-all group-hover:bg-white/[0.05] ${isHeader ? 'p-6 flex flex-col md:flex-row items-center gap-8' : 'flex flex-col h-full'}`}>

        {/* Ad Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center gap-1.5 z-10 pointer-events-none">
          <Info size={10} className="text-blue-400" />
          <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Sponsored</span>
        </div>

        {/* Ad Image */}
        <a 
          href={ad.target_url} 
          target="_blank" 
          rel="noreferrer" 
          className={`${isHeader ? 'w-full md:w-1/3 aspect-[16/9]' : 'w-full aspect-video'} rounded-xl overflow-hidden bg-black/40 border border-white/5 block group/image`}
        >
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105" 
          />
        </a>

        {/* Ad Content */}
        <div className={`flex-1 ${isHeader ? 'text-center md:text-left space-y-4' : 'p-6 flex flex-col justify-between'}`}>
          <div className="space-y-2">
            <h3 className={`font-black text-white leading-tight ${isHeader ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
              {ad.title}
            </h3>
            {isHeader && (
              <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-2xl">
                {subheading}
              </p>
            )}
          </div>

          <a
            href={ad.target_url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black transition-all shadow-xl shadow-blue-600/20 active:scale-95 ${isHeader ? 'w-fit' : 'w-full mt-4'}`}
          >
            <span>Learn More</span>
            <ExternalLink size={18} />
          </a>
        </div>

        {/* Glass Glow effect */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>
    </div>
  );
}
