import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import AdminSidebar from './AdminSidebar';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalInventory: '...',
        activeInquiries: 12, // Placeholder
        totalViews: '8.5k', // Placeholder
        reserved: 3 // Placeholder
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch total cars count
            const { count, error } = await supabase
                .from('cars')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            setStats(prev => ({
                ...prev,
                totalInventory: count
            }));

            // Fetch total views
            const { data: viewsData, error: viewsError } = await supabase
                .from('cars')
                .select('Views');

            if (viewsError) throw viewsError;

            const totalViews = viewsData.reduce((acc, curr) => acc + (curr.Views || 0), 0);

            setStats(prev => ({
                ...prev,
                totalViews: totalViews.toLocaleString()
            }));
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <header className="glass-card border-b border-white/10 p-6 flex justify-between items-center sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-md">
                    <div className="flex items-center space-x-4">
                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <i className="fas fa-bell"></i>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-[#D4AF37]">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=D4AF37&color=000" alt="Admin" />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Stat Card 1 */}
                        <div className="glass-card p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Inventory</p>
                                    <h3 className="text-3xl font-bold mt-1">{stats.totalInventory}</h3>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                                    <i className="fas fa-car text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-400 text-sm flex items-center">
                                <i className="fas fa-arrow-up mr-1"></i> +2 this month
                            </span>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="glass-card p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Active Inquiries</p>
                                    <h3 className="text-3xl font-bold mt-1">12</h3>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                                    <i className="fas fa-envelope text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-400 text-sm flex items-center">
                                <i className="fas fa-arrow-up mr-1"></i> +5 new today
                            </span>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="glass-card p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Views</p>
                                    <h3 className="text-3xl font-bold mt-1">8.5k</h3>
                                </div>
                                <div className="p-3 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
                                    <i className="fas fa-eye text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-400 text-sm flex items-center">
                                <i className="fas fa-arrow-up mr-1"></i> +12% vs last week
                            </span>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="glass-card p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Reserved</p>
                                    <h3 className="text-3xl font-bold mt-1">3</h3>
                                </div>
                                <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                                    <i className="fas fa-tag text-xl"></i>
                                </div>
                            </div>
                            <span className="text-gray-400 text-sm">Pending clearance</span>
                        </div>
                    </div>

                    {/* Placeholder Content */}
                    <div className="glass-card rounded-xl border border-white/10 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <i className="fas fa-chart-line text-3xl text-gray-500"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Inventory Management</h3>
                        <p className="text-gray-400 max-w-md">Select "Inventory" from the sidebar to manage listings, or use the quick actions above.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
