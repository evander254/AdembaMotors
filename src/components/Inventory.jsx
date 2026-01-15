import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Header from './Header';

const Inventory = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        minPrice: '',
        maxPrice: ''
    });

    // Pagination
    const CARS_PER_PAGE = 54;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch Filter Options (Brands & Models)
    useEffect(() => {
        const fetchFilterOptions = async () => {
            const { data, error } = await supabase
                .from('cars')
                .select('Brand, Model');

            if (!error && data) {
                const uniqueBrands = [...new Set(data.map(car => car.Brand))].sort();
                const uniqueModels = [...new Set(data.map(car => car.Model))].sort();
                setBrands(uniqueBrands);
                setModels(uniqueModels);
            }
        };

        fetchFilterOptions();
    }, []);

    // Fetch Cars based on Filters and Pagination
    useEffect(() => {
        fetchCars();
    }, [filters, currentPage]); // Re-fetch when filters or page changes

    const fetchCars = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('cars')
                .select('*', { count: 'exact' })
                .eq('Availability', true);

            // Apply Filters
            if (filters.brand) query = query.ilike('Brand', `%${filters.brand}%`);
            if (filters.model) query = query.ilike('Model', `%${filters.model}%`);
            if (filters.minPrice) query = query.gte('Price', filters.minPrice);
            if (filters.maxPrice) query = query.lte('Price', filters.maxPrice);

            // Pagination logic (0-based index for Supabase range)
            const from = (currentPage - 1) * CARS_PER_PAGE;
            const to = from + CARS_PER_PAGE - 1;

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            setCars(data);
            setTotalCount(count);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const totalPages = Math.ceil(totalCount / CARS_PER_PAGE);

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <Header />
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Filters Sidebar */}
                        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                            <div className="glass-card p-6 rounded-xl border border-white/10 sticky top-24">
                                <h3 className="text-xl font-bold mb-4 gold-text border-b border-white/10 pb-2">Filters</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Brand</label>
                                        <select
                                            name="brand"
                                            value={filters.brand}
                                            onChange={handleFilterChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#D4AF37] focus:outline-none"
                                        >
                                            <option value="">All Brands</option>
                                            {brands.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Model</label>
                                        <select
                                            name="model"
                                            value={filters.model}
                                            onChange={handleFilterChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#D4AF37] focus:outline-none"
                                        >
                                            <option value="">All Models</option>
                                            {models.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Price Range</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                name="minPrice"
                                                placeholder="Min"
                                                value={filters.minPrice}
                                                onChange={handleFilterChange}
                                                className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#D4AF37] focus:outline-none text-sm"
                                            />
                                            <input
                                                type="number"
                                                name="maxPrice"
                                                placeholder="Max"
                                                value={filters.maxPrice}
                                                onChange={handleFilterChange}
                                                className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-[#D4AF37] focus:outline-none text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setFilters({ brand: '', model: '', minPrice: '', maxPrice: '' })}
                                        className="w-full py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5 transition-colors text-gray-300"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Inventory <span className="text-gray-500 text-lg font-normal">({totalCount} Vehicles)</span></h2>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
                                </div>
                            ) : cars.length === 0 ? (
                                <div className="text-center py-20 text-gray-500 glass-card rounded-xl">
                                    <p className="text-xl">No vehicles match your criteria.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {cars.map((car) => (
                                            <div key={car.id} className="glass-card rounded-xl overflow-hidden group hover:border-[#D4AF37]/50 transition-all duration-300">
                                                <Link to={`/car/${car.id}`} className="block relative h-48 overflow-hidden">
                                                    <img src={car.CPic} alt={car.CarName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </Link>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-white truncate pr-2">{car.CarName}</h3>
                                                        <span className="gold-text font-bold whitespace-nowrap text-sm">Ksh. {car.Price?.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-gray-400 mt-3">
                                                        <div className="flex items-center space-x-1">
                                                            <i className="fas fa-tachometer-alt gold-text"></i>
                                                            <span>{car.Millage?.toLocaleString()} CC</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <i className="fas fa-calendar gold-text"></i>
                                                            <span>{car.ProdYear}</span>
                                                        </div>
                                                    </div>
                                                    <Link to={`/car/${car.id}`} className="block mt-4 w-full py-2 rounded bg-white/5 hover:bg-white/10 text-center text-sm transition-colors text-white border border-white/10">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-12 space-x-2">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'border-white/10 text-gray-600 cursor-not-allowed' : 'border-white/20 text-white hover:bg-white/10'}`}
                                            >
                                                Previous
                                            </button>

                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`px-4 py-2 rounded-lg border ${currentPage === i + 1 ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold' : 'border-white/20 text-white hover:bg-white/10'}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}

                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? 'border-white/10 text-gray-600 cursor-not-allowed' : 'border-white/20 text-white hover:bg-white/10'}`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
