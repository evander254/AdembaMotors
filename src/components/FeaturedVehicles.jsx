import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const FeaturedVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .eq('Availability', true)
                .order('created_at', { ascending: false })
                .limit(12);

            if (error) throw error;
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="featured" className="py-20 px-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
            </section>
        );
    }

    return (
        <section id="featured" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 fade-in">
                    <h2 className="text-4xl font-bold mb-4">Featured <span className="gold-text">Vehicles</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Curated selection of timeless classics, each meticulously restored and certified for authenticity.</p>
                </div>

                {vehicles.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p>No inventory currently available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((car) => (
                            <div key={car.id} className="glass-card rounded-2xl overflow-hidden group fade-in flex flex-col">
                                <Link to={`/car/${car.id}`} className="block relative overflow-hidden h-64">
                                    <img src={car.CPic} alt={car.CarName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 gold-gradient text-black font-bold px-3 py-1 rounded-full text-sm">
                                        Available
                                    </div>
                                </Link>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold truncate pr-2">{car.CarName}</h3>
                                        <span className="text-xl font-bold gold-text whitespace-nowrap">Ksh. {car.Price?.toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{car.Description}</p>
                                    <div className="flex justify-between text-sm text-gray-400 mb-6 mt-auto">
                                        <div className="flex items-center space-x-1">
                                            <i className="fas fa-tachometer-alt gold-text"></i>
                                            <span>{car.Millage?.toLocaleString()} CC</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <i className="fas fa-calendar gold-text"></i>
                                            <span>{car.ProdYear}</span>
                                        </div>
                                    </div>
                                    <Link to={`/car/${car.id}`} className="w-full glass-card py-3 rounded-lg font-medium hover:bg-white/10 transition-colors text-center block">
                                        <span className="gold-text">View Details</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-16 fade-in">
                    <Link to="/inventory">
                        <button className="glass-card px-10 py-4 rounded-full font-medium hover:bg-white/10 transition-colors border gold-border">
                            <span className="gold-text text-lg">View Full Inventory</span>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedVehicles;
