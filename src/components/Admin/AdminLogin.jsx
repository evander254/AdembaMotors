import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Query the 'Admin' table directly as requested
            const { data, error: dbError } = await supabase
                .from('Admin')
                .select('*')
                .eq('Username', username)
                .eq('Password', password)
                .single();

            if (dbError) {
                // If .single() returns no rows, it throws an error (PGRST116)
                if (dbError.code === 'PGRST116') {
                    throw new Error('Invalid username or password');
                }
                throw dbError;
            }

            if (data) {
                // Login successful
                console.log('Login successful:', data);
                // Optionally store session/state here (skipping for this simple implementation)
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] opacity-10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900 opacity-10 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 glass-card p-10 rounded-2xl w-full max-w-md backdrop-blur-xl border-white/10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-black font-bold text-3xl">A</span>
                    </div>
                    <h2 className="text-3xl font-bold">Admin <span className="gold-text">Portal</span></h2>
                    <p className="text-gray-400 mt-2">Sign in to manage inventory</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full glass-card bg-white/5 border border-white/10 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="Enter admin username"
                                required
                            />
                            <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full glass-card bg-white/5 border border-white/10 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                placeholder="Enter admin password"
                                required
                            />
                            <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gold-gradient text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                        {loading ? (
                            <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-gray-400 hover:gold-text text-sm transition-colors">
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to Website
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
