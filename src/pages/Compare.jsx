import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Smartphone, RefreshCcw, Plus, X, Search, Filter } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function Compare() {
  const [devicesList, setDevicesList] = useState([]);
  const [device1, setDevice1] = useState(null);
  const [device2, setDevice2] = useState(null);
  const [device3, setDevice3] = useState(null);
  const [showSlot3, setShowSlot3] = useState(false);
  
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [searchTerm3, setSearchTerm3] = useState('');
  
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [brands, setBrands] = useState(['All']);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const { data } = await supabase.from('devices').select('*');
    if (data) {
      setDevicesList(data);
      const uniqueBrands = ['All', ...new Set(data.map(d => d.brand))];
      setBrands(uniqueBrands);
    }
  };

  const getFilteredDevices = (searchTerm) => {
    return devicesList.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           d.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || d.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  };

  const renderDeviceSelector = (slotNum, selectedDevice, setDevice, searchTerm, setSearchTerm) => {
    const filtered = getFilteredDevices(searchTerm);
    
    return (
      <div className="space-y-4 relative">
        <div className="flex justify-between items-center">
          <label className={`block text-sm font-bold uppercase tracking-wider ${
            slotNum === 1 ? 'text-blue-400' : slotNum === 2 ? 'text-purple-400' : 'text-emerald-400'
          }`}>
            Device {slotNum}
          </label>
          {slotNum === 3 && (
            <button 
              onClick={() => { setShowSlot3(false); setDevice(null); }}
              className="text-gray-500 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="Search brand or model..."
            value={selectedDevice ? selectedDevice.name : searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (selectedDevice) setDevice(null);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all"
          />
          
          {!selectedDevice && searchTerm && (
            <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl">
              {filtered.length > 0 ? filtered.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDevice(d);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 text-white transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="font-bold">{d.name}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-tighter">{d.brand} • {formatPrice(d.price)}</div>
                </button>
              )) : (
                <div className="px-4 py-3 text-gray-500 text-sm">No devices found</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
          Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Smarter.</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
          Choose Faster.
        </p>
      </div>

      {/* Brand Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {brands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
              selectedBrand === brand 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
        
        <div className={`grid grid-cols-1 gap-8 mb-12 ${showSlot3 ? 'lg:grid-cols-3 md:grid-cols-2' : 'md:grid-cols-2'}`}>
          {renderDeviceSelector(1, device1, setDevice1, searchTerm1, setSearchTerm1)}
          {renderDeviceSelector(2, device2, setDevice2, searchTerm2, setSearchTerm2)}
          
          {showSlot3 ? (
            renderDeviceSelector(3, device3, setDevice3, searchTerm3, setSearchTerm3)
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl group hover:border-blue-500/50 transition-all cursor-pointer h-[88px] mt-9" onClick={() => setShowSlot3(true)}>
              <div className="flex items-center gap-3 text-gray-500 group-hover:text-blue-400 font-bold transition-colors">
                <Plus size={24} />
                <span>Add 3rd Device</span>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {(device1 || device2 || device3) ? (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
            <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="p-4 w-40 text-center uppercase tracking-wider font-semibold bg-white/[0.02]">Features</th>
                  <th className="p-6 text-center border-l border-white/5 text-blue-300">
                    {device1 ? (
                      <div className="flex flex-col items-center">
                        <Smartphone size={32} className="mb-2 text-blue-400" />
                        <span className="text-xl font-bold text-white mb-2 leading-tight">{device1.name}</span>
                        <span className="text-blue-400 font-black text-lg">{formatPrice(device1.price)}</span>
                      </div>
                    ) : <span className="text-gray-500 font-medium">Slot 1 Empty</span>}
                  </th>
                  <th className="p-6 text-center border-l border-white/5 text-purple-300">
                    {device2 ? (
                      <div className="flex flex-col items-center">
                        <Smartphone size={32} className="mb-2 text-purple-400" />
                        <span className="text-xl font-bold text-white mb-2 leading-tight">{device2.name}</span>
                        <span className="text-purple-400 font-black text-lg">{formatPrice(device2.price)}</span>
                      </div>
                    ) : <span className="text-gray-500 font-medium">Slot 2 Empty</span>}
                  </th>
                  {showSlot3 && (
                    <th className="p-6 text-center border-l border-white/5 text-emerald-300">
                      {device3 ? (
                        <div className="flex flex-col items-center">
                          <Smartphone size={32} className="mb-2 text-emerald-400" />
                          <span className="text-xl font-bold text-white mb-2 leading-tight">{device3.name}</span>
                          <span className="text-emerald-400 font-black text-lg">{formatPrice(device3.price)}</span>
                        </div>
                      ) : <span className="text-gray-500 font-medium">Slot 3 Empty</span>}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {[
                    { label: 'Brand', key: 'brand' },
                    { label: 'Category', key: 'category' },
                    { label: 'RAM', key: 'ram' },
                    { label: 'Storage', key: 'storage' },
                    { label: 'Processor', key: 'processor' },
                    { label: 'Camera', key: 'camera' },
                    { label: 'Battery', key: 'battery' },
                    { label: 'Display', key: 'display' },
                    { label: 'Flipkart Price', key: 'flipkart_price', type: 'price' }
                  ].map((row, i) => (
                   <tr key={row.key} className={`${i % 2 === 0 ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.05] transition-colors`}>
                     <td className="p-4 font-black text-gray-400 text-center uppercase tracking-widest text-[10px] bg-white/[0.01]">{row.label}</td>
                     <td className={`p-4 border-l border-white/5 text-center font-bold ${device1 ? 'text-white' : 'text-gray-600 italic font-normal'}`}>
                       {device1 ? (row.type === 'price' ? (device1[row.key] ? formatPrice(device1[row.key]) : 'N/A') : device1[row.key] || 'N/A') : '-'}
                     </td>
                     <td className={`p-4 border-l border-white/5 text-center font-bold ${device2 ? 'text-white' : 'text-gray-600 italic font-normal'}`}>
                       {device2 ? (row.type === 'price' ? (device2[row.key] ? formatPrice(device2[row.key]) : 'N/A') : device2[row.key] || 'N/A') : '-'}
                     </td>
                     {showSlot3 && (
                       <td className={`p-4 border-l border-white/5 text-center font-bold ${device3 ? 'text-white' : 'text-gray-600 italic font-normal'}`}>
                         {device3 ? (row.type === 'price' ? (device3[row.key] ? formatPrice(device3[row.key]) : 'N/A') : device3[row.key] || 'N/A') : '-'}
                       </td>
                     )}
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <RefreshCcw size={64} className="mb-6 opacity-20 animate-spin-slow" />
            <p className="text-2xl font-medium tracking-tight">Select devices to start comparing</p>
            <p className="text-sm mt-2 opacity-50">You can compare up to 3 devices head-to-head.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
}
