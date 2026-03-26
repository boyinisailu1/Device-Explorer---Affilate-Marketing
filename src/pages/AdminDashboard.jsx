import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import { LayoutDashboard, LogOut, Plus, Edit, Trash2, Smartphone, DollarSign, Database, X, Camera, Save, Loader, AlertCircle, ShieldCheck, Megaphone, Globe, ToggleLeft, ToggleRight, ExternalLink as ExternalLinkIcon, RefreshCcw, Newspaper } from 'lucide-react';
import { formatPrice } from '../lib/utils';

const AUTHORIZED_AD_EMAILS = ['sayiluindia7@gmail.com', 'boyinisayilu@gmail.com'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // current admin's user id
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Smartphones',
    price: '',
    ram: '',
    storage: '',
    processor: '',
    display: '',
    camera: '',
    battery: '',
    os: '',
    connectivity: '',
    images: [],
    amazonLink: '',
    flipkartLink: '',
    officialLink: '',
    // Category-specific specs
    watch_type: '',
    dial_shape: '',
    strap_material: '',
    case_material: '',
    water_resistance: '',
    audio_type: '',
    driver_size: '',
    noise_cancellation: '',
    frequency_response: ''
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [syncingId, setSyncingId] = useState(null); // Tracking active price syncs
  const [formError, setFormError] = useState(null);

  // --- Ads State ---
  const [activeTab, setActiveTab] = useState('devices'); // 'devices' or 'ads'
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [adFormData, setAdFormData] = useState({
    title: '',
    image_url: '',
    target_url: '',
    position: 'header',
    is_active: true
  });
  const [isAdManager, setIsAdManager] = useState(false);
  const [adImageFile, setAdImageFile] = useState(null);
  const [adDragging, setAdDragging] = useState(false);
  
  // --- News State ---
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    image_url: '',
    content: '',
    news_url: ''
  });
  const [newsImageFile, setNewsImageFile] = useState(null);
  const [newsDragging, setNewsDragging] = useState(false);

  useEffect(() => {
    if (user?.email && AUTHORIZED_AD_EMAILS.includes(user.email)) {
      setIsAdManager(true);
    } else {
      setIsAdManager(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDevices();
    if (isAdManager) fetchAds();
    fetchNews();
  }, [isAdManager]);

  // Handle incoming editId from state
  useEffect(() => {
    if (location.state?.editId && devices.length > 0) {
      const deviceToEdit = devices.find(d => d.id === location.state.editId);
      if (deviceToEdit) {
        openEditModal(deviceToEdit);
        // Clear state once handled to avoid re-opening on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, devices]);

  // Handle incoming category from state (pre-fill category during Add Device)
  useEffect(() => {
    if (location.state?.category) {
      openAddModal();
      setFormData(prev => ({ ...prev, category: location.state.category }));
      // Clear state once handled
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.category]);

  const fetchDevices = async () => {
    setLoading(true);
    const { data } = await supabase.from('devices').select('*').order('createdAt', { ascending: false });
    setDevices(data || []);
    setLoading(false);
  };

  const fetchAds = async () => {
    setLoadingAds(true);
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    setAds(data || []);
    setLoadingAds(false);
  };

  const fetchNews = async () => {
    setLoadingNews(true);
    const { data } = await supabase.from('device_news').select('*').order('created_at', { ascending: false });
    setNews(data || []);
    setLoadingNews(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id)
        .eq('admin_id', user?.id); // RLS enforces this; belt-and-suspenders
      if (!error) {
        setDevices(devices.filter(d => d.id !== id));
      } else {
        alert('Could not delete: you can only delete your own devices.');
      }
    }
  };

  const openAddModal = () => {
    setEditingDevice(null);
    setFormData({
      name: '', brand: '', category: 'Smartphones', price: '',
      ram: '', storage: '', processor: '', display: '',
      camera: '', battery: '', os: '', connectivity: '',
      images: [], amazonLink: '', flipkartLink: '', officialLink: '',
      watch_type: '', dial_shape: '', strap_material: '', case_material: '', water_resistance: '',
      audio_type: '', driver_size: '', noise_cancellation: '', frequency_response: ''
    });
    setImageFiles([]);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (device) => {
    setEditingDevice(device);
    setFormData({
      ...device,
      price: device.price.toString()
    });
    setImageFiles([]);
    setFormError(null);
    setShowModal(true);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeStagedFile = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setFormError(null);

    try {
      let uploadedUrls = [...formData.images];

      // Upload new images if any
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const filePath = `device-${Date.now()}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('device_images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('device_images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }

      const finalData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        images: uploadedUrls
      };

      let deviceId = editingDevice?.id;

      if (editingDevice) {
        // Only update own device (RLS enforces this on DB too)
        const { error } = await supabase
          .from('devices')
          .update(finalData)
          .eq('id', editingDevice.id)
          .eq('admin_id', user?.id);
        if (error) throw error;
      } else {
        // Stamp admin_id so this admin owns the device
        const { data, error } = await supabase
          .from('devices')
          .insert([{ ...finalData, admin_id: user?.id }])
          .select('id')
          .single();
        if (error) throw error;
        deviceId = data.id;
      }

      // Trigger automatic price sync (Flipkart Only)
      if (deviceId && finalData.flipkartLink) {
        setSyncingId(deviceId);
        supabase.functions.invoke('sync-prices', {
          body: { deviceId }
        }).then(() => {
          fetchDevices(); // Refresh to show new prices once sync completes
        }).catch(err => {
          console.error('Sync failed:', err);
        }).finally(() => {
          setSyncingId(null);
        });
      }

      setShowModal(false);
      fetchDevices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleManualSync = async (deviceId, flipkartLink) => {
    if (!deviceId || !flipkartLink) return;
    
    setSyncingId(deviceId);
    try {
      await supabase.functions.invoke('sync-prices', {
        body: { deviceId }
      });
      await fetchDevices();
    } catch (err) {
      console.error('Manual sync failed:', err);
    } finally {
      setSyncingId(null);
    }
  };

  // --- Ad Management Handlers ---
  const openAddAdModal = () => {
    setEditingAd(null);
    setAdFormData({ title: '', image_url: '', target_url: '', position: 'header', is_active: true });
    setAdImageFile(null);
    setAdDragging(false);
    setShowAdModal(true);
  };

  const openEditAdModal = (ad) => {
    setEditingAd(ad);
    setAdFormData({
      title: ad.title,
      image_url: ad.image_url,
      target_url: ad.target_url,
      position: ad.position,
      is_active: ad.is_active
    });
    setAdImageFile(null);
    setAdDragging(false);
    setShowAdModal(true);
  };

  const handleAdDelete = async (id) => {
    if (window.confirm('Delete this ad?')) {
      const { error } = await supabase.from('ads').delete().eq('id', id);
      if (!error) fetchAds();
    }
  };

  const handleAdToggle = async (ad) => {
    const { error } = await supabase.from('ads').update({ is_active: !ad.is_active }).eq('id', ad.id);
    if (!error) fetchAds();
  };

  const handleAdFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = adFormData.image_url;

      // Handle File Upload if a file is staged
      if (adImageFile) {
        const fileExt = adImageFile.name.split('.').pop();
        const filePath = `ad-${Date.now()}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('device_images') // Using existing bucket for reliability
          .upload(filePath, adImageFile);
        
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('device_images')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      const submissionData = { ...adFormData, image_url: finalImageUrl };

      if (editingAd) {
        const { error } = await supabase.from('ads').update(submissionData).eq('id', editingAd.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('ads').insert([submissionData]);
        if (error) throw error;
      }
      setShowAdModal(false);
      fetchAds();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // --- News Management Handlers ---
  const openAddNewsModal = () => {
    setEditingNews(null);
    setNewsFormData({ title: '', image_url: '', content: '', news_url: '' });
    setNewsImageFile(null);
    setNewsDragging(false);
    setShowNewsModal(true);
  };

  const openEditNewsModal = (item) => {
    setEditingNews(item);
    setNewsFormData({
      title: item.title,
      image_url: item.image_url,
      content: item.content,
      news_url: item.news_url || ''
    });
    setNewsImageFile(null);
    setNewsDragging(false);
    setShowNewsModal(true);
  };

  const handleNewsDelete = async (id) => {
    if (window.confirm('Delete this news article?')) {
      const { error } = await supabase.from('device_news').delete().eq('id', id);
      if (!error) fetchNews();
    }
  };

  const handleNewsFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = newsFormData.image_url;

      if (newsImageFile) {
        const fileExt = newsImageFile.name.split('.').pop();
        const filePath = `news-${Date.now()}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('device_images')
          .upload(filePath, newsImageFile);
        
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('device_images')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      const submissionData = { ...newsFormData, image_url: finalImageUrl, admin_id: user?.id };

      if (editingNews) {
        const { error } = await supabase.from('device_news').update(submissionData).eq('id', editingNews.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('device_news').insert([submissionData]);
        if (error) throw error;
      }
      setShowNewsModal(false);
      fetchNews();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { title: 'Total Devices', value: devices.length, icon: Smartphone, color: 'text-blue-500' },
    { title: 'Categories', value: new Set(devices.map(d => d.category)).size, icon: Database, color: 'text-purple-500' },
    { title: 'Avg Price', value: formatPrice(Math.round(devices.reduce((acc, d) => acc + d.price, 0) / (devices.length || 1))), icon: DollarSign, color: 'text-green-500' },
  ];

  return (
    <div className="flex h-screen overflow-hidden pt-16 bg-[#0B0F19]">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col py-6">
        <div className="px-6 mb-8 text-white/50 text-xs font-bold uppercase tracking-widest">Admin Control</div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('devices')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium w-full text-left transition-all ${activeTab === 'devices' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('devices')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium w-full text-left transition-all ${activeTab === 'devices' ? 'text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Smartphone size={20} />
            <span>Devices</span>
          </button>

          <button 
            onClick={() => setActiveTab('news')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium w-full text-left transition-all ${activeTab === 'news' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Newspaper size={20} />
            <span>Device News</span>
          </button>
          
          {isAdManager && (
            <button 
              onClick={() => setActiveTab('ads')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium w-full text-left transition-all ${activeTab === 'ads' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Megaphone size={20} />
              <span>Ad Manager</span>
            </button>
          )}

          <div className="pt-4 border-t border-white/5 mt-4">
            <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
              <Globe size={20} />
              <span>View Website</span>
            </Link>
          </div>
        </nav>
        <div className="px-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl font-medium transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {activeTab === 'devices' ? (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-extrabold text-white">System Dashboard</h1>
              <button onClick={openAddModal} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                <Plus size={20} />
                <span>Add New Device</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, i) => (
                <div key={i} className="glass p-6 rounded-2xl border border-white/5 group relative overflow-hidden transition-all hover:bg-white/[0.08]">
                   <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <stat.icon size={120} />
                  </div>
                  <div className="flex items-center space-x-6 relative z-10">
                    <div className={`p-4 bg-white/5 rounded-xl ${stat.color} shadow-inner`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{stat.title}</p>
                      <h3 className="text-4xl text-white font-black mt-1">{stat.value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Device Table */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/40">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="text-blue-500" size={20} />
                  <span>Device Inventory</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-6">Product Information</th>
                      <th className="p-6">Category</th>
                      <th className="p-6">Flipkart Price</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {loading ? (
                      <tr><td colSpan="4" className="p-20 text-center text-gray-500">Retrieving system data...</td></tr>
                    ) : devices.length === 0 ? (
                      <tr><td colSpan="4" className="p-20 text-center text-gray-500">No devices in inventory.</td></tr>
                    ) : (
                      devices.map((device) => {
                        const isOwner = device.admin_id === user?.id;
                        return (
                        <tr key={device.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                                {device.images?.[0] ? <img src={device.images[0]} className="w-full h-full object-cover" /> : <Smartphone size={20} className="text-gray-600" />}
                              </div>
                              <div>
                                <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                  {device.name}
                                  {isOwner && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-[10px] font-black tracking-widest">
                                      <ShieldCheck size={10} />
                                      MINE
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 uppercase font-medium">{device.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400">
                              {device.category}
                            </span>
                          </td>
                           <td className="p-6 font-bold text-blue-400 tracking-tight">
                            <div className="flex items-center gap-2">
                              {syncingId === device.id ? (
                                <div className="flex items-center gap-2 text-blue-500/80 animate-pulse text-xs">
                                  <RefreshCcw size={14} className="animate-spin" />
                                  <span>Fetching Price...</span>
                                </div>
                              ) : (
                                device.flipkart_price ? formatPrice(device.flipkart_price) : <span className="text-gray-600 font-normal">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {isOwner ? (
                                <>
                                  <button 
                                    onClick={() => handleManualSync(device.id, device.flipkartLink)} 
                                    className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all disabled:opacity-50" 
                                    disabled={syncingId === device.id}
                                    title="Sync Flipkart Price"
                                  >
                                    <RefreshCcw size={18} className={syncingId === device.id ? "animate-spin" : ""} />
                                  </button>
                                  <button onClick={() => openEditModal(device)} className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all" title="Edit device">
                                    <Edit size={18} />
                                  </button>
                                  <button onClick={() => handleDelete(device.id)} className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all" title="Delete device">
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-gray-600 italic px-3" title="You can only edit/delete your own devices">
                                  View only
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );})
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'ads' ? (
          /* Ad Management View */
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-extrabold text-white">Ad Management</h1>
              <button 
                onClick={openAddAdModal}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span>Create New Ad</span>
              </button>
            </div>

            <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/40">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Megaphone className="text-blue-500" size={20} />
                  <span>Active Campaigns</span>
                  <button onClick={fetchAds} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all ml-2" title="Refresh Ads">
                    <Database size={14} className={loadingAds ? "animate-spin" : ""} />
                  </button>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-6">Ad Content</th>
                      <th className="p-6">Placement</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {loadingAds ? (
                      <tr><td colSpan="4" className="p-20 text-center text-gray-500">Retrieving ad data...</td></tr>
                    ) : ads.length === 0 ? (
                      <tr><td colSpan="4" className="p-20 text-center text-gray-500">No active ads. Click "Create New Ad" to start.</td></tr>
                    ) : (
                      ads.map((ad) => (
                        <tr key={ad.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-24 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center relative">
                                {ad.image_url ? (
                                  <img 
                                    src={ad.image_url} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'; }}
                                  />
                                ) : (
                                  <Camera size={20} className="text-gray-700" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white">{ad.title}</div>
                                <div className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                                  <Globe size={10} />
                                  {ad.target_url}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-blue-400">
                              {ad.position}
                            </span>
                          </td>
                          <td className="p-6">
                            <button onClick={() => handleAdToggle(ad)} className="transition-all hover:scale-110">
                              {ad.is_active ? (
                                <span className="flex items-center gap-2 text-green-400 text-xs font-bold">
                                  <ToggleRight size={24} />
                                  ACTIVE
                                </span>
                              ) : (
                                <span className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                  <ToggleLeft size={24} />
                                  PAUSED
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button 
                                onClick={() => openEditAdModal(ad)} 
                                className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all group/btn"
                                title="Edit Campaign"
                              >
                                <Edit size={18} className="transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button 
                                onClick={() => handleAdDelete(ad.id)} 
                                className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group/btn"
                                title="Delete Campaign"
                              >
                                <Trash2 size={18} className="transition-transform group-hover/btn:scale-110" />
                              </button>
                              <a 
                                href={ad.target_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-all group/btn"
                                title="Check Target URL"
                              >
                                <ExternalLinkIcon size={18} className="transition-transform group-hover/btn:scale-110" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* News Management View */
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-extrabold text-white">Device News</h1>
              <button 
                onClick={openAddNewsModal}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span>Post News</span>
              </button>
            </div>

            <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/40">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Newspaper className="text-blue-500" size={20} />
                  <span>Launch Archive</span>
                  <button onClick={fetchNews} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all ml-2" title="Refresh News">
                    <Database size={14} className={loadingNews ? "animate-spin" : ""} />
                  </button>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-6">Article</th>
                      <th className="p-6">Date</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {loadingNews ? (
                      <tr><td colSpan="3" className="p-20 text-center text-gray-500">Retrieving news data...</td></tr>
                    ) : news.length === 0 ? (
                      <tr><td colSpan="3" className="p-20 text-center text-gray-500">No news articles yet.</td></tr>
                    ) : (
                      news.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center relative">
                                <img src={item.image_url} className="w-full h-full object-cover" />
                              </div>
                              <div className="max-w-md">
                                <div className="font-bold text-white truncate">{item.title}</div>
                                <div className="text-[10px] text-gray-500 line-clamp-1">{item.content}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-xs text-gray-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button 
                                onClick={() => openEditNewsModal(item)} 
                                className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                                title="Edit News"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleNewsDelete(item.id)} 
                                className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Delete News"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Device Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !uploading && setShowModal(false)}></div>
          <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 shadow-2xl relative z-10">
            <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#161b2c] z-20">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {editingDevice ? <Edit className="text-blue-500" /> : <Plus className="text-blue-500" />}
                {editingDevice ? 'Modify Device' : 'Add New Device'}
              </h2>
              <button onClick={() => !uploading && setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
              {formError && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 border-b border-blue-500/20 pb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Device Name</label>
                      <input 
                        type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Brand</label>
                      <input 
                        type="text" required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                      <select 
                        value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                      >
                        {['Smartphones', 'Laptops', 'Tablets', 'Watches', 'Audio'].map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Base Price (₹)</label>
                      <input 
                        type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>                 {/* Dynamic Specs based on Category */}
                 <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-purple-400 border-b border-purple-500/20 pb-2">Detailed Specifications</h3>
                    
                    {/* Smartphones, Laptops, Tablets */}
                    {(formData.category === 'Smartphones' || formData.category === 'Laptops' || formData.category === 'Tablets') && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">RAM</label><input type="text" value={formData.ram || ''} onChange={(e) => setFormData({...formData, ram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Storage</label><input type="text" value={formData.storage || ''} onChange={(e) => setFormData({...formData, storage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Processor</label><input type="text" value={formData.processor || ''} onChange={(e) => setFormData({...formData, processor: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Display</label><input type="text" value={formData.display || ''} onChange={(e) => setFormData({...formData, display: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Camera</label><input type="text" value={formData.camera || ''} onChange={(e) => setFormData({...formData, camera: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Battery</label><input type="text" value={formData.battery || ''} onChange={(e) => setFormData({...formData, battery: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">OS</label>
                          <input type="text" value={formData.os || ''} onChange={(e) => setFormData({...formData, os: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Connectivity</label>
                          <input type="text" value={formData.connectivity || ''} onChange={(e) => setFormData({...formData, connectivity: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/>
                        </div>
                      </div>
                    )}

                    {/* Watches */}
                    {formData.category === 'Watches' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Watch Type</label>
                          <select 
                            value={formData.watch_type || ''} onChange={(e) => setFormData({...formData, watch_type: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none appearance-none"
                          >
                            <option value="" className="bg-gray-900">Select Type</option>
                            <option value="Digital / Smartwatch" className="bg-gray-900">Digital / Smartwatch</option>
                            <option value="Analogue" className="bg-gray-900">Analogue</option>
                            <option value="Hybrid" className="bg-gray-900">Hybrid</option>
                          </select>
                        </div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Dial Shape</label><input type="text" placeholder="e.g. Round, Square" value={formData.dial_shape || ''} onChange={(e) => setFormData({...formData, dial_shape: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Water Resistance</label><input type="text" placeholder="e.g. 5ATM, IP68" value={formData.water_resistance || ''} onChange={(e) => setFormData({...formData, water_resistance: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Strap Material</label><input type="text" placeholder="e.g. Silicone, Leather" value={formData.strap_material || ''} onChange={(e) => setFormData({...formData, strap_material: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Case Material</label><input type="text" placeholder="e.g. Aluminum, Steel" value={formData.case_material || ''} onChange={(e) => setFormData({...formData, case_material: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Display</label><input type="text" placeholder='e.g. 1.43" AMOLED' value={formData.display || ''} onChange={(e) => setFormData({...formData, display: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Battery Life</label><input type="text" placeholder="e.g. 7 Days" value={formData.battery || ''} onChange={(e) => setFormData({...formData, battery: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1 col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">OS / Movement</label><input type="text" placeholder="e.g. WearOS, Quartz" value={formData.os || ''} onChange={(e) => setFormData({...formData, os: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                      </div>
                    )}

                    {/* Audio */}
                    {formData.category === 'Audio' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Audio Type</label>
                          <select 
                            value={formData.audio_type || ''} onChange={(e) => setFormData({...formData, audio_type: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none appearance-none"
                          >
                            <option value="" className="bg-gray-900">Select Audio Type</option>
                            <option value="True Wireless (Earbuds)" className="bg-gray-900">True Wireless (Earbuds)</option>
                            <option value="Over-Ear Headphones" className="bg-gray-900">Over-Ear Headphones</option>
                            <option value="Sound System / Speakers" className="bg-gray-900">Sound System / Speakers</option>
                            <option value="Soundbar" className="bg-gray-900">Soundbar</option>
                          </select>
                        </div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Driver Size</label><input type="text" placeholder="e.g. 11mm, 40mm" value={formData.driver_size || ''} onChange={(e) => setFormData({...formData, driver_size: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Noise Cancellation</label><input type="text" placeholder="e.g. Active (ANC), Environmental" value={formData.noise_cancellation || ''} onChange={(e) => setFormData({...formData, noise_cancellation: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Frequency Response</label><input type="text" placeholder="e.g. 20Hz - 20kHz" value={formData.frequency_response || ''} onChange={(e) => setFormData({...formData, frequency_response: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Battery Life</label><input type="text" placeholder="e.g. 30 Hours" value={formData.battery || ''} onChange={(e) => setFormData({...formData, battery: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                        <div className="space-y-1 col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Connectivity</label><input type="text" placeholder="e.g. Bluetooth 5.3, Wired" value={formData.connectivity || ''} onChange={(e) => setFormData({...formData, connectivity: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-green-400 border-b border-green-500/20 pb-2">Product Media & Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                   <div className="space-y-4">
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer bg-white/5 relative group ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-white/10 hover:border-blue-500/50'}`}
                      >
                        <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <Camera size={40} className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`} />
                        <p className="text-base font-black text-white">Drop images here</p>
                        <p className="text-xs text-gray-500 font-medium">or click to browse local files</p>
                        {imageFiles.length > 0 && (
                          <div className="mt-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full inline-block animate-pulse">
                            {imageFiles.length} FILES READY FOR UPLOAD
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Add External Image URL</label>
                        <div className="flex gap-2">
                          <input 
                            id="external-url-input"
                            type="text" 
                            placeholder="https://..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white text-xs outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (e.target.value) {
                                  setFormData({...formData, images: [...formData.images, e.target.value]});
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('external-url-input');
                              if (input.value) {
                                setFormData({...formData, images: [...formData.images, input.value]});
                                input.value = '';
                              }
                            }}
                            className="px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition-all text-xs"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Gallery ({formData.images.length + imageFiles.length} items)</label>
                      <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                          {formData.images.map((url, i) => (
                            <div key={`existing-${i}`} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-xl">
                              <img src={url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  type="button"
                                  onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})}
                                  className="p-2 bg-red-600 rounded-lg text-white transform scale-75 group-hover:scale-100 transition-transform"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-gray-400 font-bold">LINKED</div>
                            </div>
                          ))}
                          {imageFiles.map((file, i) => (
                            <div key={`staged-${i}`} className="aspect-square rounded-xl overflow-hidden border-2 border-blue-500/30 bg-blue-500/10 flex flex-col items-center justify-center relative group">
                                <Camera size={20} className="text-blue-400" />
                                <span className="text-[8px] font-black text-blue-400 mt-2 uppercase text-center px-2 truncate w-full">{file.name}</span>
                                <button 
                                  type="button"
                                  onClick={() => removeStagedFile(i)}
                                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <X size={10} />
                                </button>
                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-600 rounded text-[8px] text-white font-black">STAGED</div>
                            </div>
                          ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Buying Links */}
              <div className="space-y-4">
                 <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 border-b border-indigo-500/20 pb-2">Marketplace Integration</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Amazon URL</label><input type="text" value={formData.amazonLink} onChange={(e) => setFormData({...formData, amazonLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Flipkart URL</label><input type="text" value={formData.flipkartLink} onChange={(e) => setFormData({...formData, flipkartLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Official Store URL</label><input type="text" value={formData.officialLink} onChange={(e) => setFormData({...formData, officialLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"/></div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
                 <button type="button" onClick={() => !uploading && setShowModal(false)} className="px-8 py-3 text-gray-400 font-bold hover:text-white transition-colors">Cancel</button>
                 <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-10 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black shadow-xl transition-all flex items-center gap-2"
                 >
                   {uploading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                   <span>{editingDevice ? 'Update Device Record' : 'Create Device Entry'}</span>
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !uploading && setShowAdModal(false)}></div>
          <div className="glass w-full max-w-2xl rounded-3xl border border-white/20 shadow-2xl relative z-10">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {editingAd ? <Edit className="text-blue-500" /> : <Plus className="text-blue-500" />}
                {editingAd ? 'Modify Ad Campaign' : 'Create New Ad'}
              </h2>
              <button onClick={() => !uploading && setShowAdModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAdFormSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Ad Title / Campaign Name</label>
                  <input 
                    type="text" required value={adFormData.title} onChange={(e) => setAdFormData({...adFormData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Summer Sale 2024"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Banner Graphics</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Upload for Ad */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setAdDragging(true); }}
                      onDragLeave={() => setAdDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setAdDragging(false); if(e.dataTransfer.files[0]) setAdImageFile(e.dataTransfer.files[0]); }}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer bg-white/5 relative group ${adDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-blue-500/50'}`}
                    >
                      <input type="file" onChange={(e) => e.target.files[0] && setAdImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Camera size={32} className={`mx-auto mb-2 transition-colors ${adDragging ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`} />
                      <p className="text-xs font-black text-white">{adImageFile ? adImageFile.name : 'Drop Banner File'}</p>
                      <p className="text-[10px] text-gray-500">or click to browse</p>
                      {adImageFile && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); setAdImageFile(null); }} className="mt-2 text-[10px] text-red-400 hover:text-red-300 font-bold uppercase underline">Remove</button>
                      )}
                    </div>
                    {/* URL Input for Ad */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Or use Image URL</label>
                        <input 
                          type="text" value={adFormData.image_url} onChange={(e) => setAdFormData({...adFormData, image_url: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-[10px] text-blue-400 font-medium leading-tight">
                          💡 Tip: For Header ads, use 1200x400. For Device Launchpad, use 800x600.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Target / Destination URL</label>
                  <input 
                    type="text" required value={adFormData.target_url} onChange={(e) => setAdFormData({...adFormData, target_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Placement Position</label>
                    <select 
                      value={adFormData.position} onChange={(e) => setAdFormData({...adFormData, position: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none appearance-none"
                    >
                      <option value="header" className="bg-gray-900">Header Banner</option>
                      <option value="sidebar" className="bg-gray-900">Sidebar Slot</option>
                      <option value="device_launchpad" className="bg-gray-900">Latest Updates / Device Launchpad</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex flex-col justify-center">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2">Campaign Status</label>
                    <button 
                      type="button"
                      onClick={() => setAdFormData({...adFormData, is_active: !adFormData.is_active})}
                      className="flex items-center gap-3 text-white text-sm font-bold"
                    >
                      {adFormData.is_active ? <ToggleRight size={32} className="text-green-500" /> : <ToggleLeft size={32} className="text-gray-500" />}
                      {adFormData.is_active ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>
              </div>

              {adFormData.image_url && (
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
                  <div className="p-2 border-b border-white/5 text-[10px] font-black text-gray-500 uppercase text-center">Live Preview</div>
                  <img src={adFormData.image_url} className="w-full h-32 object-contain p-4" alt="Preview" />
                </div>
              )}

              <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                 <button type="button" onClick={() => !uploading && setShowAdModal(false)} className="px-6 py-2 text-gray-400 font-bold hover:text-white transition-colors text-sm">Cancel</button>
                 <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black shadow-xl transition-all flex items-center gap-2"
                 >
                   {uploading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                   <span>{editingAd ? 'Update Ad' : 'Launch Campaign'}</span>
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !uploading && setShowNewsModal(false)}></div>
          <div className="glass w-full max-w-2xl rounded-3xl border border-white/20 shadow-2xl relative z-10">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Newspaper className="text-blue-500" />
                {editingNews ? 'Edit News Article' : 'Post New Device News'}
              </h2>
              <button onClick={() => !uploading && setShowNewsModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleNewsFormSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Article Title</label>
                  <input 
                    type="text" required value={newsFormData.title} onChange={(e) => setNewsFormData({...newsFormData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. iPhone 16 Pro Max Launched!"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Feature Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setNewsDragging(true); }}
                      onDragLeave={() => setNewsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setNewsDragging(false); if(e.dataTransfer.files[0]) setNewsImageFile(e.dataTransfer.files[0]); }}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white/5 relative group ${newsDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-blue-500/50'}`}
                    >
                      <input type="file" onChange={(e) => e.target.files[0] && setNewsImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Camera size={32} className="mx-auto mb-2 text-gray-500" />
                      <p className="text-xs font-black text-white">{newsImageFile ? newsImageFile.name : 'Upload Image'}</p>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase">Or Image URL</label>
                       <input 
                        type="text" value={newsFormData.image_url} onChange={(e) => setNewsFormData({...newsFormData, image_url: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">News URL / Source (Optional)</label>
                  <input 
                    type="text" value={newsFormData.news_url} onChange={(e) => setNewsFormData({...newsFormData, news_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/full-story"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Article Content (2-3 Paragraphs)</label>
                  <textarea 
                    required 
                    value={newsFormData.content} 
                    onChange={(e) => setNewsFormData({...newsFormData, content: e.target.value})}
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the new device in detail..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                 <button type="button" onClick={() => !uploading && setShowNewsModal(false)} className="px-6 py-2 text-gray-400 font-bold hover:text-white transition-colors text-sm">Cancel</button>
                 <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black shadow-xl transition-all flex items-center gap-2"
                 >
                   {uploading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                   <span>{editingNews ? 'Update News' : 'Publish Article'}</span>
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
