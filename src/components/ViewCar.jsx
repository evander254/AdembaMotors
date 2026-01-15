import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from './Header';
import Footer from './Footer';

const ViewCar = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);

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
            setCar(data);
            setActiveImage(data.CPic);

            // Increment View Count (Fire and forget)
            const newViews = (data.Views || 0) + 1;
            await supabase
                .from('cars')
                .update({ Views: newViews })
                .eq('id', id);

        } catch (error) {
            console.error('Error fetching car details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
                <Link to="/" className="text-[#D4AF37] hover:underline">Return Home</Link>
            </div>
        );
    }

    // Parse gallery images (assuming comma-separated string)
    const galleryImages = car.Gallery ? car.Gallery.split(',') : [];
    const allImages = [car.CPic, ...galleryImages].filter(Boolean);

    const handleContact = () => {
        const message = encodeURIComponent(`Hello, I am interested in buying the ${car.CarName}. Is it still available?`);
        window.open(`https://wa.me/254729661126?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Header />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-gray-400 text-sm mb-8">
                        <Link to="/" className="hover:text-white">Home</Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <Link to="/#featured" className="hover:text-white">Inventory</Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <span className="text-[#D4AF37]">{car.CarName}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="glass-card rounded-2xl overflow-hidden aspect-[4/3] relative">
                                <img src={activeImage} alt={car.CarName} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(img)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#D4AF37]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Car Details */}
                        <div>
                            <div className="mb-2">
                                <span className="text-[#D4AF37] font-medium tracking-wider text-sm uppercase">{car.Brand}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{car.CarName}</h1>
                            <p className="text-3xl font-bold text-[#D4AF37] mb-8">Ksh.{car.Price?.toLocaleString()}</p>

                            <div className="glass-card p-6 rounded-xl mb-8">
                                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Specifications</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm">Make</span>
                                        <span className="font-medium">{car.Brand}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm">Model</span>
                                        <span className="font-medium">{car.Model}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm">Year</span>
                                        <span className="font-medium">{car.ProdYear}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm">CC</span>
                                        <span className="font-medium">{car.Millage?.toLocaleString()} CC</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm">Status</span>
                                        <span className={car.Availability ? "text-green-400" : "text-red-400"}>
                                            {car.Availability ? 'Available' : 'Sold / Reserved'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-xl font-bold mb-4">Vehicle Description</h3>
                                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                                    {car.Description}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleContact}
                                    className="flex-1 gold-gradient text-black font-bold py-4 rounded-full hover:opacity-90 transition-opacity"
                                >
                                    <i className="fab fa-whatsapp mr-2"></i>Contact Now
                                </button>
                                <button className="flex-1 glass-card border border-[#D4AF37] text-[#D4AF37] font-bold py-4 rounded-full hover:bg-[#D4AF37]/10 transition-colors">
                                    Schedule Viewing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ViewCar;
