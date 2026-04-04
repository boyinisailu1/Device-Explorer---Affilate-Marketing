import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Filter, Search, Plus, BarChart3 } from 'lucide-react';
import DeviceCard from '../components/DeviceCard';
import { useAuth } from '../components/AuthContext';

export default function DeviceListing() {
  const { profile } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category') || 'All';
  const searchParam = queryParams.get('search') || '';

  // Filters State
  const [filters, setFilters] = useState({
    search: searchParam,
    category: categoryParam,
    brand: '',
    ram: '',
  });

  useEffect(() => {
    const fetchDevices = async () => {
    setLoading(true);
    let query = supabase.from('devices').select('*');
    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }
    if (filters.brand) {
      query = query.ilike('brand', `%${filters.brand}%`);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
    }
    const { data } = await query;
    setDevices(data || []);
    setLoading(false);
    };
    fetchDevices();
  }, [filters.category, filters.brand, filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-8">
          <div className="glass p-6 rounded-2xl sticky top-24">
            <div className="flex items-center space-x-2 text-xl font-bold mb-6">
              <Filter className="w-5 h-5 text-blue-500" />
              <span>Filters</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="All" className="bg-gray-900 text-white">All Categories</option>
                  <option value="Smartphones" className="bg-gray-900 text-white">Smartphones</option>
                  <option value="Tablets" className="bg-gray-900 text-white">Tablets</option>
                  <option value="Laptops" className="bg-gray-900 text-white">Laptops</option>
                  <option value="Watches" className="bg-gray-900 text-white">Watches</option>
                  <option value="Audio" className="bg-gray-900 text-white">Audio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Brand</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="" className="bg-gray-900 text-white">All Brands</option>
                  <option value="Apple" className="bg-gray-900 text-white">Apple</option>
                  <option value="Samsung" className="bg-gray-900 text-white">Samsung</option>
                  <option value="Google" className="bg-gray-900 text-white">Google</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search devices..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Grid */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {filters.category !== 'All' ? filters.category : 'All Devices'}
              </h1>
              <p className="text-gray-400">
                {loading ? 'Loading...' : `${devices.length} device${devices.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
            <div className="flex gap-3">
              {devices.length > 0 && (
                <Link 
                  to={`/compare?category=${filters.category}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl font-bold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all text-sm whitespace-nowrap"
                >
                  <BarChart3 size={18} />
                  Compare
                </Link>
              )}
              {profile?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  state={{ category: filters.category !== 'All' ? filters.category : 'Smartphones' }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all text-sm"
                >
                  <Plus size={18} />
                  <span>Add</span>
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : devices.length === 0 ? (
            <div className="glass p-12 rounded-3xl text-center">
              <p className="text-gray-400 text-xl">No devices found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {devices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}