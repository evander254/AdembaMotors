import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import AdminSidebar from './AdminSidebar';

const AddInventory = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

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
    const [galleryPhotos, setGalleryPhotos] = useState([]);

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

    const handleGalleryChange = (e) => {
        if (e.target.files) {
            setGalleryPhotos(Array.from(e.target.files));
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
            if (!coverPhoto) throw new Error("Please select a cover photo");

            // 1. Upload Cover Photo
            const coverUrl = await uploadImage(coverPhoto, 'covers');

            // 2. Upload Gallery Photos
            const galleryUrls = [];
            for (const photo of galleryPhotos) {
                const url = await uploadImage(photo, `gallery/${formData.carName.replace(/\s+/g, '_')}`);
                galleryUrls.push(url);
            }

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('cars')
                .insert([{
                    CarName: formData.carName,
                    Brand: formData.brand,
                    Model: formData.model,
                    ProdYear: parseInt(formData.prodYear),
                    Millage: parseInt(formData.millage),
                    Description: formData.description,
                    Price: parseFloat(formData.price),
                    CPic: coverUrl,
                    Gallery: galleryUrls.join(','), // Assuming comma-separated string
                    Availability: formData.availability
                }]);

            if (dbError) throw dbError;

            setMessage({ type: 'success', text: 'Car added to inventory successfully!' });
            // Reset Form
            setFormData({
                carName: '', brand: '', model: '', prodYear: '', millage: '',
                price: '', description: '', availability: true
            });
            setCoverPhoto(null);
            setGalleryPhotos([]);

        } catch (error) {
            console.error('Error adding inventory:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to add car to inventory' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto">
                <header className="glass-card border-b border-white/10 p-6 sticky top-0 z-10 bg-[#0A0A0A]/80 backdrop-blur-md">
                    <h1 className="text-2xl font-bold">Add Inventory</h1>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Cover Photo (CPic)</label>
                                <input onChange={handleCoverChange} type="file" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b8941f]" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Gallery Images</label>
                                <input onChange={handleGalleryChange} type="file" accept="image/*" multiple className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20" />
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

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-black ${loading ? 'bg-gray-600' : 'gold-gradient hover:opacity-90'} transition-all`}
                        >
                            {loading ? <span className="flex items-center justify-center"><i className="fas fa-spinner fa-spin mr-2"></i> Uploading...</span> : 'Add Vehicle'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddInventory;
