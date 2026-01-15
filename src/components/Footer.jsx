import React from 'react';

const Footer = () => {
    return (
        <footer className="glass-card border-t border-white/10 py-10 px-6 mt-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-6 md:mb-0">
                        <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                            <span className="text-black font-bold">A</span>
                        </div>
                        <h3 className="text-xl font-bold">Ademba<span className="gold-text">Motors</span></h3>
                    </div>

                    <div className="text-center mb-6 md:mb-0">
                        <p className="text-gray-400">Specialists in classic automobiles since 2021</p>
                        <p className="text-gray-500 text-sm mt-1">Mombasa • Kenya</p>
                    </div>

                    <div className="flex space-x-4">
                        <a href="#" className="glass-card w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                            <i className="fab fa-instagram gold-text"></i>
                        </a>
                        <a href="#" className="glass-card w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                            <i className="fab fa-facebook-f gold-text"></i>
                        </a>
                        <a href="#" className="glass-card w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                            <i className="fab fa-twitter gold-text"></i>
                        </a>
                    </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-white/10">
                    <p className="text-gray-500 text-sm">© 2026 AdembaMotors. All rights reserved. | Timeless Classics</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
