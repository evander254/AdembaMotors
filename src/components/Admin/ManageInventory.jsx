import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import AdminSidebar from './AdminSidebar';
import { Link } from 'react-router-dom';

const ManageInventory = ({ mode }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCars(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
            try {
                const { error } = await supabase
                    .from('cars')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                // Remove from state
                setCars(cars.filter(car => car.id !== id));
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                alert('Failed to delete vehicle');
            }
        }
    };

    const filteredCars = cars.filter(car =>
        car.CarName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.Brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.Model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPageTitle = () => {
        switch (mode) {
            case 'edit': return 'Edit Inventory';
            case 'delete': return 'Delete Inventory';
            default: return 'View Inventory';
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto">
                <header className="glass-card border-b border-white/10 p-6 flex justify-between items-center sticky top-0 z-10 bg-[#0A0A0A]/80 backdrop-blur-md">
                    <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="glass-card bg-white/5 border border-white/10 rounded-full py-2 px-4 pl-10 text-white focus:outline-none focus:border-[#D4AF37] w-64"
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
                        </div>
                    ) : (
                        <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="p-4 text-gray-400 font-medium text-sm">Image</th>
                                        <th className="p-4 text-gray-400 font-medium text-sm">Name</th>
                                        <th className="p-4 text-gray-400 font-medium text-sm hidden md:table-cell">Details</th>
                                        <th className="p-4 text-gray-400 font-medium text-sm">Price</th>
                                        <th className="p-4 text-gray-400 font-medium text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCars.map((car) => (
                                        <tr key={car.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <img src={car.CPic} alt={car.CarName} className="w-16 h-12 object-cover rounded" />
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold">{car.CarName}</div>
                                                <div className="text-sm text-gray-400 md:hidden">{car.Brand} {car.Model}</div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="text-sm text-gray-300">
                                                    <span className="text-gray-500">Brand:</span> {car.Brand} •
                                                    <span className="text-gray-500 ml-2">Model:</span> {car.Model} •
                                                    <span className="text-gray-500 ml-2">Year:</span> {car.ProdYear}
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#D4AF37] font-medium">
                                                Ksh. {car.Price?.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                {mode === 'edit' && (
                                                    <Link
                                                        to={`/admin/edit-car/${car.id}`}
                                                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                                {mode === 'delete' && (
                                                    <button
                                                        onClick={() => handleDelete(car.id)}
                                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                                {mode === 'view' && (
                                                    <Link
                                                        to={`/car/${car.id}`}
                                                        target="_blank"
                                                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredCars.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    No vehicles found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageInventory;
