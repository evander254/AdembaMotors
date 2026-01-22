import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const defaultSlides = [
    {
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        title: "1967 Mercedes-Benz 280SL",
        description: "Fully restored with matching numbers and original interior. A timeless classic in pristine condition.",
        mileage: "42,000 mi",
        transmission: "Manual",
        price: "Ksh.185,000"
    },
    {
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        title: "1965 Ford Mustang Fastback",
        description: "Iconic American muscle with complete frame-off restoration. V8 engine, 4-speed manual transmission.",
        mileage: "68,500 mi",
        transmission: "Manual",
        price: "Ksh.890,000"
    },
    {
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        title: "1973 Porsche 911 Carrera RS",
        description: "Legendary lightweight sports car with matching numbers. One of only 1,580 ever produced.",
        mileage: "32,200 mi",
        transmission: "Manual",
        price: "Ksh.450,000"
    }
];

const Hero = () => {
    const [slides, setSlides] = useState(defaultSlides);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('cars')
                .select('*');

            if (error) throw error;

            if (data && data.length > 0) {
                // Shuffle array and pick 3
                const shuffled = data.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);

                const formattedSlides = selected.map(car => ({
                    image: car.CPic || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3", // Fallback image
                    title: car.CarName || "Unknown Car",
                    description: car.Description ? (car.Description.length > 100 ? car.Description.substring(0, 100) + "..." : car.Description) : "No description available.",
                    mileage: car.Millage ? `${car.Millage} km` : "N/A",
                    transmission: "Automatic", // Default as it's missing in DB schema provided
                    price: car.Price ? `Ksh.${car.Price.toLocaleString()}` : "Price On Request"
                }));

                // Only update if we have at least 1 car, otherwise keep default
                if (formattedSlides.length > 0) {
                    setSlides(formattedSlides);
                }
            }
        } catch (error) {
            console.error('Error fetching hero cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 800);
    };

    const prevSlide = () => {
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 800);
    };

    const goToSlide = (index) => {
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 800);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 8000);
        return () => clearInterval(timer);
    }, [slides]); // Added dependency on slides

    // Effect to trigger fade-in animation on slide change
    useEffect(() => {
        const content = document.getElementById(`slide-content-${currentIndex}`);
        if (content) {
            content.classList.remove('fade-in');
            void content.offsetWidth; // trigger reflow
            content.classList.add('fade-in');
        }
    }, [currentIndex]);


    return (
        <section className="relative overflow-hidden h-[85vh]">
            <div
                className="carousel-container flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="carousel-slide relative w-full flex-shrink-0 h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 z-20 flex items-center">
                            <div className="max-w-7xl mx-auto px-6 w-full">
                                <div id={`slide-content-${index}`} className={`max-w-2xl glass-card p-8 rounded-2xl backdrop-blur-lg ${index === currentIndex ? 'fade-in' : ''}`}>
                                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                                    <p className="text-xl text-gray-300 mb-6">{slide.description}</p>
                                    <div className="flex flex-wrap items-center gap-6 mb-6 text-sm md:text-base">
                                        <div className="flex items-center space-x-2">
                                            <i className="fas fa-tachometer-alt gold-text"></i>
                                            <span>{slide.mileage}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <i className="fas fa-cog gold-text"></i>
                                            <span>{slide.transmission}</span>
                                        </div>
                                        <div className="text-2xl font-bold gold-text">{slide.price}</div>
                                    </div>
                                    <button className="gold-gradient text-black font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls - Only show if more than 1 slide */}
            {slides.length > 1 && (
                <>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
                        <button onClick={prevSlide} className="glass-card w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                            <i className="fas fa-chevron-left gold-text"></i>
                        </button>
                        <button onClick={nextSlide} className="glass-card w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                            <i className="fas fa-chevron-right gold-text"></i>
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'gold-gradient bg-white/80' : 'bg-white/30 hover:bg-white/60'
                                    }`}
                            ></button>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default Hero;
