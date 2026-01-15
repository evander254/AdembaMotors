import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from './Header';
import Footer from './Footer';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                if (query.trim()) {
                    const { data, error } = await supabase
                        .from('cars')
                        .select('*')
                        .eq('Availability', true)
                        .or(`CarName.ilike.%${query}%,Brand.ilike.%${query}%,Model.ilike.%${query}%`);

                    if (error) throw error;
                    setResults(data || []);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Error searching cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Header />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                        <p className="text-gray-400">
                            Showing results for "<span className="text-[#D4AF37]">{query}</span>"
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-20 glass-card rounded-2xl border border-white/10">
                            <i className="fas fa-search text-4xl text-gray-600 mb-4"></i>
                            <h2 className="text-xl font-bold mb-2">No vehicles found</h2>
                            <p className="text-gray-400 mb-6">We couldn't find any current inventory matching your search.</p>
                            <Link to="/" className="gold-gradient text-black font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                                View All Inventory
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {results.map((car) => (
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
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SearchResults;
