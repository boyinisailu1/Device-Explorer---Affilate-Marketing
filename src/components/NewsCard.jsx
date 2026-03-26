import { Calendar, Tag, ChevronRight } from 'lucide-react';

export default function NewsCard({ news, index }) {
  const isImageLeft = index % 2 === 0;
  
  const createdDate = new Date(news.created_at);
  const now = new Date();
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isNew = diffDays <= 10;

  return (
    <div className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-2xl">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur" />
      
      <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} h-full`}>
        {/* Image Section */}
        <div className="md:w-2/5 relative overflow-hidden aspect-video md:aspect-auto">
          <img 
            src={news.image_url} 
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Badge */}
          {isNew && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                New Launch
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(news.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
              <span className="w-1.2 h-1.2 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Featured
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
              {news.title}
            </h3>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4 md:line-clamp-6 mb-6 font-light">
              {news.content}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            {news.news_url ? (
              <a 
                href={news.news_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group/btn"
              >
                Read Full Story 
                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
            ) : (
              <div className="text-sm font-semibold text-gray-500">
                Official Launch
              </div>
            )}
            <div className="h-0.5 w-12 bg-white/5 group-hover:w-24 group-hover:bg-blue-500/50 transition-all duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
