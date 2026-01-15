import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import AdminSidebar from './AdminSidebar';

const EditCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        carName: '',
        brand: '',
        model: '',
        prodYear: '',
        millage: '',
        price: '',
        description: '',
        availability: true,
    });

    const [coverPhoto, setCoverPhoto] = useState(null);
    const [currentCoverUrl, setCurrentCoverUrl] = useState('');

    useEffect(() => {
        fetchCarDetails();
    }, [id]);

    const fetchCarDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setFormData({
                carName: data.CarName,
                brand: data.Brand,
                model: data.Model,
                prodYear: data.ProdYear,
                millage: data.Millage,
                price: data.Price,
                description: data.Description,
                availability: data.Availability
            });
            setCurrentCoverUrl(data.CPic);
        } catch (error) {
            console.error('Error fetching car:', error);
            setMessage({ type: 'error', text: 'Failed to load vehicle details' });
        } finally {
            setFetchLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCoverChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCoverPhoto(e.target.files[0]);
        }
    };

    const uploadImage = async (file, path) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('AdembaCars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('AdembaCars')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            let coverUrl = currentCoverUrl;

            // 1. Upload New Cover Photo if selected
            if (coverPhoto) {
                coverUrl = await uploadImage(coverPhoto, 'covers');
            }

            // 2. Update Database
            const { error: dbError } = await supabase
                .from('cars')
                .update({
                    CarName: formData.carName,
                    Brand: formData.brand,
                    Model: formData.model,
                    ProdYear: parseInt(formData.prodYear),
                    Millage: parseInt(formData.millage),
                    Description: formData.description,
                    Price: parseFloat(formData.price),
                    CPic: coverUrl,
                    Availability: formData.availability
                })
                .eq('id', id);

            if (dbError) throw dbError;

            setMessage({ type: 'success', text: 'Vehicle updated successfully!' });
            // Optional: Redirect back to inventory after short delay
            setTimeout(() => {
                navigate('/admin/inventory/view');
            }, 1500);

        } catch (error) {
            console.error('Error updating inventory:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to update vehicle' });
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 overflow-y-auto h-screen">
                <header className="glass-card border-b border-white/10 p-6 sticky top-0 z-10 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center space-x-4">
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                    <h1 className="text-2xl font-bold">Edit Vehicle</h1>
                </header>

                <div className="p-8 max-w-4xl mx-auto">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                            <i className={`fas fa-${message.type === 'success' ? 'check' : 'exclamation'}-circle mr-2`}></i>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-xl border border-white/10 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Car Name</label>
                                <input name="carName" value={formData.carName} onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Brand</label>
                                <input name="brand" value={formData.brand} onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Model</label>
                                <input name="model" value={formData.model} onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Production Year</label>
                                <input name="prodYear" value={formData.prodYear} onChange={handleInputChange} type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Mileage</label>
                                <input name="millage" value={formData.millage} onChange={handleInputChange} type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Price</label>
                                <input name="price" value={formData.price} onChange={handleInputChange} type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none" required></textarea>
                        </div>

                        {/* Images */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Cover Photo</label>
                                <div className="flex items-center space-x-4 mb-3">
                                    {currentCoverUrl && <img src={currentCoverUrl} alt="Current Cover" className="w-20 h-16 object-cover rounded" />}
                                    <span className="text-sm text-gray-500">Current Image</span>
                                </div>
                                <input onChange={handleCoverChange} type="file" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b8941f]" />
                                <p className="text-xs text-gray-500 mt-1">Leave blank to keep current image</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="availability"
                                checked={formData.availability}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] bg-gray-700"
                            />
                            <label className="text-gray-300">Available for sale</label>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/inventory/view')}
                                className="w-1/3 py-4 rounded-lg font-bold text-white bg-white/10 hover:bg-white/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-4 rounded-lg font-bold text-black ${loading ? 'bg-gray-600' : 'gold-gradient hover:opacity-90'} transition-all`}
                            >
                                {loading ? <span className="flex items-center justify-center"><i className="fas fa-spinner fa-spin mr-2"></i> Updating...</span> : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditCar;
