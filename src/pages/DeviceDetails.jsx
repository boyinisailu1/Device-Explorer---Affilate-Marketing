import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink, Smartphone, Cpu, HardDrive, Battery, Camera, Monitor, Wifi, Settings, ChevronLeft, ChevronRight, Watch, Speaker, Activity, Wind, Volume2, Layers, Package, Droplets, Square, Zap } from 'lucide-react';
import Hero3D from '../components/Hero3D';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import { formatPrice } from '../lib/utils';

// eslint-disable-next-line no-unused-vars
function SpecItem({ icon: Icon, label, value }) {
  return (
    <div className="glass p-5 rounded-2xl flex items-start space-x-4 group glass-hover transition-all border border-white/5 relative overflow-hidden">
      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-500/20 text-gray-400 group-hover:text-blue-400 transition-colors shadow-inner">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-xs text-gray-500 group-hover:text-gray-300 font-black uppercase tracking-widest">{label}</h4>
        <p className="font-bold text-white mt-1 group-hover:text-blue-100 text-lg leading-tight">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
export default function DeviceDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    supabase.from('devices').select('*').eq('id', id).single().then(({ data }) => {
      if(data) {
        setDevice(data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest text-blue-400">LOADING DEVICE DATA...</p>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen pt-32 text-center text-white">
        <p className="text-2xl font-black text-red-500">DEVICE NOT FOUND</p>
      </div>
    );
  }

  const images = device.images || [];

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-stretch">
        {/* Image Gallery / 3D */}
        <div className="space-y-4">
          <div className="glass rounded-[2.5rem] p-4 aspect-square flex items-center justify-center relative shadow-2xl border border-white/10 overflow-hidden bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
            
            {images.length > 0 ? (
              <img 
                src={images[activeImage]} 
                alt={device.name} 
                className="w-full h-full object-contain p-4 transition-all duration-500" 
              />
            ) : (
              <div className="w-full h-full relative z-10 scale-110">
                <Hero3D />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-white/5 hover:border-white/20'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] rounded-full tracking-[0.2em] uppercase">
              {device.brand} &bull; {device.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
              {device.name}
            </h1>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 inline-block mt-2">
              {formatPrice(device.price)}
            </p>
            {profile?.role === 'admin' && (
              <Link 
                to="/admin/dashboard" 
                state={{ editId: device.id }}
                className="ml-6 inline-flex items-center gap-2 px-6 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all font-bold text-xs tracking-widest uppercase shadow-lg group"
              >
                <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                <span>Edit Device</span>
              </Link>
            )}
          </div>

          <p className="text-xl text-gray-400 leading-relaxed max-w-xl font-medium">
            {device.category === 'Watches' ? (
              `Experience precision with the ${device.name} by ${device.brand}. Featuring a ${device.dial_shape || 'premium'} design and ${device.water_resistance || 'rugged'} durability.`
            ) : device.category === 'Audio' ? (
              `Immerse yourself in sound with the ${device.name} by ${device.brand}. Engineered with ${device.driver_size || 'high-fidelity'} drivers and ${device.noise_cancellation || 'advanced noise isolation'}.`
            ) : (
              `Explore the cutting-edge features of the ${device.name} by ${device.brand}. Equipped with ${device.processor || 'advanced processing'} and ${device.ram || 'flexible memory'} options.`
            )}
          </p>
          
          <div className="pt-8 border-t border-white/10 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Marketplace Integration</h3>
            <div className="flex flex-wrap gap-4">
              {device.amazonLink && (
                <a href={device.amazonLink} target="_blank" rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-4 px-6 rounded-2xl font-bold border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <ShoppingCart size={20} className="text-orange-500" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-500 uppercase font-black tracking-tight">Buy on</div>
                    <div className="text-sm">Amazon</div>
                  </div>
                </a>
              )}
              {device.flipkartLink && (
                <a href={device.flipkartLink} target="_blank" rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Zap size={20} />
                  <div className="text-left">
                    <div className="text-[10px] text-blue-200 uppercase font-black tracking-tight">
                      {device.flipkart_price ? `Grab for ${formatPrice(device.flipkart_price)}` : 'Buy on'}
                    </div>
                    <div className="text-sm">Flipkart</div>
                  </div>
                </a>
              )}
              {device.officialLink && (
                <a href={device.officialLink} target="_blank" rel="noreferrer" className="flex items-center space-x-3 px-8 py-4 glass hover:bg-white/10 text-white font-black rounded-2xl transition-all group active:scale-95">
                   <ExternalLink size={20} className="group-hover:text-blue-400" />
                   <span>OFFICIAL STORE</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="mb-24">
        <div className="flex items-center space-x-4 mb-12">
          <div className="h-px bg-white/10 flex-1"></div>
          <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white flex items-center space-x-3 whitespace-nowrap">
            <Settings className="text-blue-500" />
            <span>Technical DNA</span>
          </h2>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Watches Specific */}
          {device.category === 'Watches' ? (
            <>
              <SpecItem icon={Watch} label="Watch Type" value={device.watch_type} />
              <SpecItem icon={Square} label="Dial Shape" value={device.dial_shape} />
              <SpecItem icon={Droplets} label="Water Resistance" value={device.water_resistance} />
              <SpecItem icon={Layers} label="Strap Material" value={device.strap_material} />
              <SpecItem icon={Package} label="Case Material" value={device.case_material} />
              <SpecItem icon={Monitor} label="Display" value={device.display} />
              <SpecItem icon={Battery} label="Battery Life" value={device.battery} />
              <SpecItem icon={Settings} label="OS / Movement" value={device.os} />
              <SpecItem icon={Wifi} label="Connectivity" value={device.connectivity} />
            </>
          ) : device.category === 'Audio' ? (
            <>
              <SpecItem icon={Volume2} label="Audio Type" value={device.audio_type} />
              <SpecItem icon={Speaker} label="Driver Size" value={device.driver_size} />
              <SpecItem icon={Wind} label="Noise Cancellation" value={device.noise_cancellation} />
              <SpecItem icon={Activity} label="Freq. Response" value={device.frequency_response} />
              <SpecItem icon={Battery} label="Battery Life" value={device.battery} />
              <SpecItem icon={Wifi} label="Connectivity" value={device.connectivity} />
            </>
          ) : (
            <>
              <SpecItem icon={Cpu} label="Processor Unit" value={device.processor} />
              <SpecItem icon={HardDrive} label="RAM Memory" value={device.ram} />
              <SpecItem icon={HardDrive} label="Storage Capacity" value={device.storage} />
              <SpecItem icon={Monitor} label="Display Matrix" value={device.display} />
              <SpecItem icon={Camera} label="Optics System" value={device.camera} />
              <SpecItem icon={Battery} label="Energy Cell" value={device.battery} />
              <SpecItem icon={Settings} label="Core OS" value={device.os} />
              <SpecItem icon={Wifi} label="Connectivity" value={device.connectivity} />
            </>
          )}
        </div>
      </div>

    </div>
  );
}
