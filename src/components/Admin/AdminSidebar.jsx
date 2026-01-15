import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const [isInventoryOpen, setIsInventoryOpen] = useState(true);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 glass-card border-r border-white/10 hidden md:flex flex-col bg-[#0A0A0A]">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">A</span>
                    </div>
                    <h2 className="text-xl font-bold">Ademba<span className="gold-text">Admin</span></h2>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link to="/admin/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <i className="fas fa-tachometer-alt w-5 text-center"></i>
                    <span>Dashboard</span>
                </Link>

                {/* Inventory Collapsible */}
                <div>
                    <button
                        onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <i className="fas fa-car w-5 text-center"></i>
                            <span>Inventory</span>
                        </div>
                        <i className={`fas fa-chevron-down transition-transform ${isInventoryOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {isInventoryOpen && (
                        <div className="pl-12 mt-1 space-y-1">
                            <Link to="/admin/add-inventory" className={`block py-2 px-3 text-sm rounded-lg transition-colors ${isActive('/admin/add-inventory') ? 'text-[#D4AF37] bg-white/5' : 'text-gray-500 hover:text-white'}`}>
                                - Add Inventory
                            </Link>
                            <Link to="/admin/inventory/view" className={`block py-2 px-3 text-sm rounded-lg transition-colors ${isActive('/admin/inventory/view') ? 'text-[#D4AF37] bg-white/5' : 'text-gray-500 hover:text-white'}`}>
                                - View Inventory
                            </Link>
                            <Link to="/admin/inventory/edit" className={`block py-2 px-3 text-sm rounded-lg transition-colors ${isActive('/admin/inventory/edit') ? 'text-[#D4AF37] bg-white/5' : 'text-gray-500 hover:text-white'}`}>
                                - Edit Inventory
                            </Link>
                            <Link to="/admin/inventory/delete" className={`block py-2 px-3 text-sm rounded-lg transition-colors ${isActive('/admin/inventory/delete') ? 'text-[#D4AF37] bg-white/5' : 'text-gray-500 hover:text-white'}`}>
                                - Delete Inventory
                            </Link>
                        </div>
                    )}
                </div>

                <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                    <i className="fas fa-envelope w-5 text-center"></i>
                    <span>Inquiries</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                    <i className="fas fa-users w-5 text-center"></i>
                    <span>Customers</span>
                </a>
            </nav>

            <div className="p-4 border-t border-white/10">
                <a href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    <i className="fas fa-sign-out-alt w-5 text-center"></i>
                    <span>Logout</span>
                </a>
            </div>
        </aside>
    );
};

export default AdminSidebar;
