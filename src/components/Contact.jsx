import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle the form submission, e.g., sending an email or saving to Supabase
        const subject = encodeURIComponent('New Contact Us Message');
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
        window.location.href = `mailto:info@adembamotors.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Header />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Contact <span className="gold-text">Us</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Have questions or want to schedule a viewing? We're here to help. Reach out to us through any of the channels below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info & Map */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                                        <i className="fas fa-phone-alt text-[#D4AF37]"></i>
                                    </div>
                                    <h3 className="font-bold mb-2">Phone</h3>
                                    <p className="text-gray-400 text-sm">+254 707 597 062</p>
                                    <p className="text-gray-400 text-sm">+254 722 000 000</p>
                                </div>
                                <div className="glass-card p-6 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                                        <i className="fas fa-envelope text-[#D4AF37]"></i>
                                    </div>
                                    <h3 className="font-bold mb-2">Email</h3>
                                    <p className="text-gray-400 text-sm">info@adembamotors.com</p>
                                    <p className="text-gray-400 text-sm">sales@adembamotors.com</p>
                                </div>
                                <div className="glass-card p-6 rounded-xl md:col-span-2">
                                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                                        <i className="fas fa-map-marker-alt text-[#D4AF37]"></i>
                                    </div>
                                    <h3 className="font-bold mb-2">Location</h3>
                                    <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
                                    <p className="text-gray-400 text-sm">Along Ngong Road, near Adams Arcade</p>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="glass-card p-2 rounded-xl h-64 md:h-80 w-full overflow-hidden relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.16303256087!2d36.784612!3d-1.299532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMTcnNTguMyJTIDM2wrA0NyczNC42IkU!5e0!3m2!1sen!2ske!4v1635000000000!5m2!1sen!2ske"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    className="rounded-lg grayscale opacity-70 hover:opacity-100 transition-opacity"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass-card p-8 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full glass-card bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full glass-card bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full glass-card bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="I'm interested in..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full gold-gradient text-black font-bold py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                                >
                                    <i className="fas fa-paper-plane mr-2"></i> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
