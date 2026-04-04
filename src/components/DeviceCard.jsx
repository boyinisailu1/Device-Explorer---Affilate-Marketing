import { Link } from 'react-router-dom';
import { Smartphone, ExternalLink, CheckCircle, Zap } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function DeviceCard({ device }) {
  const mainImage = device.images?.[0] || null;

  return (
    <Link 
      key={device.id} 
      to={`/devices/${device.id}`} 
      className="glass rounded-xl p-3 sm:p-5 lg:p-6 group block glass-hover transition-all border border-white/10 relative overflow-hidden h-full"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/10 blur-[30px] sm:blur-[40px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
      
      <div className="aspect-[4/3] bg-black/40 rounded-lg sm:rounded-xl mb-3 sm:mb-6 flex flex-col items-center justify-center overflow-hidden border border-white/5 shadow-inner">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={device.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <Smartphone size={40} className="sm:size-[56px] text-gray-500 opacity-50 transition-transform duration-500 group-hover:scale-110" />
        )}
      </div>

      <div className="space-y-1 sm:space-y-2 relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-blue-500 mb-0.5 sm:mb-1 block truncate flex items-center gap-1">
              {device.brand}
              {device.verified && (
                <CheckCircle size={10} className="sm:size-3 text-green-400 flex-shrink-0" title="Verified specs" />
              )}
            </span>
            <h3 className="text-sm sm:text-lg lg:text-xl font-bold group-hover:text-blue-400 transition-colors text-white truncate">{device.name}</h3>
          </div>
          <span className="font-black text-xs sm:text-base lg:text-lg text-white whitespace-nowrap">{formatPrice(device.price)}</span>
        </div>
        
        {/* Price Comparison */}
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-white/5 space-y-1">
          {device.flipkart_price && (
            <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-bold">
              <span className="text-gray-500 uppercase flex items-center gap-1">
                <ExternalLink size={8} className="sm:size-[10px] text-blue-400" />
                Flipkart
              </span>
              <span className="text-blue-400">{formatPrice(device.flipkart_price)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 pt-2 border-t border-white/5 overflow-hidden flex-wrap">
          {device.category === 'Watches' && device.watch_type && (
            <span className="text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/5 rounded text-gray-400 font-bold uppercase truncate whitespace-nowrap">{device.watch_type}</span>
          )}
          {device.category === 'Audio' && device.audio_type && (
            <span className="text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/5 rounded text-gray-400 font-bold uppercase truncate whitespace-nowrap">{device.audio_type}</span>
          )}
          {(device.category === 'Smartphones' || device.category === 'Laptops' || device.category === 'Tablets') && (
            <>
              {device.ram && <span className="text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/5 rounded text-gray-400 font-bold uppercase">{device.ram}</span>}
              {device.storage && <span className="text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/5 rounded text-gray-400 font-bold uppercase">{device.storage}</span>}
            </>
          )}
          {device.category && <span className="hidden xs:inline-block text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-500/10 text-blue-400 rounded font-bold uppercase ml-auto whitespace-nowrap">{device.category}</span>}
        </div>
      </div>
    </Link>
  );
}
