import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import { supabase } from '../supabaseClient'; // Import supabase
import logo from '../assets/ademba-logo.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // New state for mobile search
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 1) {
                const { data, error } = await supabase
                    .from('cars')
                    .select('id, CarName, Price, CPic, Brand, Model')
                    .or(`CarName.ilike.%${searchTerm}%,Brand.ilike.%${searchTerm}%,Model.ilike.%${searchTerm}%`)
                    .limit(5);

                if (error) {
                    console.error('Search error:', error);
                } else {
                    setSearchResults(data);
                    setShowResults(true);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleResultClick = (id) => {
        setSearchTerm('');
        setShowResults(false);
        setMobileSearchOpen(false); // Close mobile search on selection
        navigate(`/car/${id}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setShowResults(false);
            setMobileSearchOpen(false);
            navigate(`/search?q=${searchTerm}`);
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${scrolled ? 'glass-card bg-black/50' : ''}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={logo} alt="AdembaMotors Logo" className="w-12 h-12 object-contain" />
                    <h1 className="text-2xl font-bold tracking-tight hidden sm:block">
                        Ademba<span className="gold-text">Motors</span>
                    </h1>
                </Link>

                {/* Mobile Search Toggle */}
                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-8">
                    <Link to="/" className="text-white hover:gold-text transition-colors font-medium">Home</Link>
                    <Link to="/inventory" className="text-white hover:gold-text transition-colors font-medium">Inventory</Link>
                    <Link to="/services" className="text-white hover:gold-text transition-colors font-medium">Services</Link>
                    <Link to="/contact" className="text-white hover:gold-text transition-colors font-medium">Contact</Link>
                </nav>

                <div className="hidden md:flex items-center">
                    <button onClick={() => navigate('/contact')} className="glass-card px-6 py-2 rounded-full font-medium hover:bg-white/10 transition-colors">
                        <span className="gold-text">Inquiry</span>
                    </button>
                </div>

                {/* Mobile Controls */}
                <div className="flex md:hidden items-center space-x-4">
                    <button
                        className="text-white p-2"
                        onClick={() => {
                            setMobileSearchOpen(!mobileSearchOpen);
                            setMobileMenuOpen(false);
                        }}
                    >
                        <i className={`fas ${mobileSearchOpen ? 'fa-times' : 'fa-search'} text-xl`}></i>
                    </button>
                    <button
                        className="text-white p-2"
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen);
                            setMobileSearchOpen(false);
                        }}
                    >
                        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                    </button>
                </div>

                {/* Mobile Search Bar */}
                <div className={`${mobileSearchOpen ? 'absolute top-full left-0 right-0 p-4 glass-card bg-[#0A0A0A]' : 'hidden'} md:hidden`}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search inventory..."
                            className="w-full glass-card bg-white/5 border border-white/10 rounded-full py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                    {/* Search Results Dropdown Mobile */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 glass-card border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 bg-[#0A0A0A] mx-4">
                            {searchResults.map((car) => (
                                <div
                                    key={car.id}
                                    onClick={() => handleResultClick(car.id)}
                                    className="flex items-center p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                >
                                    <img src={car.CPic} alt={car.CarName} className="w-12 h-12 object-cover rounded-md mr-3" />
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{car.CarName}</h4>
                                        <p className="text-xs text-[#D4AF37]">Ksh. {car.Price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Search (Hidden on mobile) */}
                <div className="hidden md:block relative w-64 mx-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search..."
                            className="w-full glass-card bg-white/5 border border-white/10 rounded-full py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                    {/* Search Results Dropdown Desktop */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 glass-card border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 bg-[#0A0A0A]">
                            {searchResults.map((car) => (
                                <div
                                    key={car.id}
                                    onClick={() => handleResultClick(car.id)}
                                    className="flex items-center p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                >
                                    <img src={car.CPic} alt={car.CarName} className="w-12 h-12 object-cover rounded-md mr-3" />
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{car.CarName}</h4>
                                        <p className="text-xs text-[#D4AF37]">Ksh. {car.Price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 glass-card bg-[#0A0A0A] border-t border-white/10 md:hidden flex flex-col p-4 space-y-4">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white hover:gold-text transition-colors font-medium text-lg">Home</Link>
                        <Link to="/inventory" onClick={() => setMobileMenuOpen(false)} className="text-white hover:gold-text transition-colors font-medium text-lg">Inventory</Link>
                        <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-white hover:gold-text transition-colors font-medium text-lg">Services</Link>
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-white hover:gold-text transition-colors font-medium text-lg">Contact</Link>
                        <button onClick={() => { setMobileMenuOpen(false); navigate('/contact'); }} className="glass-card px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors w-full text-center">
                            <span className="gold-text">Inquiry</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
