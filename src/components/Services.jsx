import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Services = () => {
    const services = [
        {
            icon: 'fa-car',
            title: 'Car Sales',
            description: 'We offer a wide range of premium vehicles, from luxury sedans to rugged SUVs. Each car is inspected to ensure top quality for our customers.'
        },
        {
            icon: 'fa-hand-holding-usd',
            title: 'Financing',
            description: 'Get the best financing options tailored to your budget. We partner with leading financial institutions to make your dream car a reality.'
        },
        {
            icon: 'fa-tools',
            title: 'Maintenance',
            description: 'Our expert mechanics provide top-notch maintenance services to keep your vehicle running smoothly. From oil changes to engine diagnostics.'
        },
        {
            icon: 'fa-exchange-alt',
            title: 'Trade-Ins',
            description: 'Upgrade your ride by trading in your old vehicle. We offer competitive value assessments to help you get into your new car effectively.'
        },
        {
            icon: 'fa-shield-alt',
            title: 'Insurance',
            description: 'We assist in securing comprehensive insurance covers for your vehicle, giving you peace of mind on the road.'
        },
        {
            icon: 'fa-shipping-fast',
            title: 'Import Services',
            description: 'Looking for a specific model not in our local stock? We can help you import your desired vehicle safely and efficiently.'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Header />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Our <span className="gold-text">Services</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            At Ademba Motors, we go beyond just selling cars. We provide a comprehensive suite of automotive services designed to cater to all your needs.
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors group">
                                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                                    <i className={`fas ${service.icon} text-2xl text-[#D4AF37]`}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 glass-card p-10 rounded-3xl text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Ready to Experience Excellence?</h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                Contact us today to learn more about our services or visit our showroom to see our inventory.
                            </p>
                            <a href="/contact" className="inline-block gold-gradient text-black font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
                                Get in Touch
                            </a>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Services;
