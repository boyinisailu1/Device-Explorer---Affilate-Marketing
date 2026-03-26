import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import NewsCard from './NewsCard';
import { Newspaper, Loader } from 'lucide-react';

export default function NewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsAndAds();
  }, []);

  const fetchNewsAndAds = async () => {
    try {
      setLoading(true);
      
      // Fetch News
      const { data: newsData, error: newsError } = await supabase
        .from('device_news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (newsError) throw newsError;

      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      // Fetch Ads for News Feed (Show only those from last 10 days)
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('position', 'device_launchpad')
        .eq('is_active', true)
        .gte('created_at', tenDaysAgo.toISOString());
      
      if (adsError) throw adsError;

      // Interleave Logic: 5 News, 1 Ad
      const combined = [];
      let adIndex = 0;
      
      newsData.forEach((news, index) => {
        combined.push({ type: 'news', data: news });
        
        // After every 5 news items, insert an ad if available
        if ((index + 1) % 5 === 0 && adsData && adsData.length > 0) {
          const ad = adsData[adIndex % adsData.length];
          combined.push({ type: 'ad', data: ad });
          adIndex++;
        }
      });

      setItems(combined);
    } catch (err) {
      console.error('Error fetching news feed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader className="animate-spin text-blue-500" size={40} />
        <p className="text-gray-500 font-medium">Loading latest device news...</p>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="news-feed" className="py-24 relative">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 font-black uppercase tracking-[0.2em] text-xs">
            <Newspaper size={16} />
            <span>Latest Updates</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Device <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Launchpad</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {items.map((item, idx) => (
          <div key={idx}>
            {item.type === 'news' ? (
              <NewsCard news={item.data} index={idx} />
            ) : (
              /* Ad Card */
              <div className="glass rounded-3xl overflow-hidden border border-white/5 group relative h-48 md:h-32">
                <div className="absolute top-2 right-4 z-10">
                   <span className="text-[10px] font-black text-white/30 tracking-widest uppercase italic">Sponsored Content</span>
                </div>
                <a 
                  href={item.data.target_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex flex-col md:flex-row h-full items-center"
                >
                  <div className="w-full md:w-1/4 h-full relative overflow-hidden bg-white/5">
                    <img 
                      src={item.data.image_url} 
                      alt="Ad" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 p-6 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                        {item.data.title}
                      </h4>
                      <p className="text-sm text-gray-400">Exclusive deals and offers for DeviceX community members.</p>
                    </div>
                    <div className="px-6 py-2 bg-blue-600 group-hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-center">
                      Learn More
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
