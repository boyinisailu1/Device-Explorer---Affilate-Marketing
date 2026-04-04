import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import NewsCard from '../components/NewsCard';
import { Newspaper, Loader } from 'lucide-react';

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      // Fetch News
      const { data: newsData, error: newsError } = await supabase
        .from('device_news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (newsError) throw newsError;

      setItems(newsData || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold">Device News & Updates</h1>
        </div>
        <p className="text-gray-400 text-lg">Stay updated with the latest device launches, reviews, and tech news</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-400">Loading news...</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center">
          <Newspaper className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-lg">No news articles available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((news, index) => (
            <NewsCard key={news.id || index} news={news} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
