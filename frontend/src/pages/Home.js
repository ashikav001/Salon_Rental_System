import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Lightweight inline icons (no extra npm install needed)
const Icon = {
    Sparkle: () => (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        </svg>
    ),
    Clock: () => (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    ),
    Shield: () => (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        </svg>
    ),
    Calendar: () => (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
    ),
};

function Home() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const assetImages = {
    'Hair Dryer - Professional': '/images/hair-dryer.jpg',
    'Salon Styling chair': '/images/service-placeholder.jpg',
    'Facial Steamer': '/images/facial-steamer.jpg',
    'Hair Straightener': '/images/hair-straightener.jpg',
    'Manicure Table': '/images/manicure-table.jpg',
    'Makeup Kit' : '/images/makeup-kit.jpg',
};

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('/api/service');
                setServices(res.data.slice(0, 6));
            } catch (err) {
                console.error('Failed to load services', err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="home">

            {/* Hero */}
            <section className="hero">
                <div className="hero-overlay" />
                <div className="hero-content">
                    <span className="hero-eyebrow">Salon Rental System</span>
                    <h1>Effortless bookings, <em>beautifully</em> simple.</h1>
                    <p>Reserve professional salon equipment and services in a few taps — with automatic, transparent pricing every time.</p>
                    <div className="hero-actions">
                        <Link to="/assets" className="btn btn-gold">Browse Services</Link>
                        <Link to="/login" className="btn btn-ghost">Register / Login</Link>
                    </div>
                </div>
            </section>

            {/* Trust strip */}
            <section className="trust-strip">
                <div className="trust-item">
                    <Icon.Shield /><span>Verified Professionals</span>
                </div>
                <div className="trust-item">
                    <Icon.Calendar /><span>Flexible Date Booking</span>
                </div>
                <div className="trust-item">
                    <Icon.Sparkle /><span>Automatic Pricing</span>
                </div>
                <div className="trust-item">
                    <Icon.Clock /><span>Easy Return Tracking</span>
                </div>
            </section>

            {/* Featured services */}
            <section className="section">
                <h2 className="section-title">Featured Services</h2>
                <p className="section-sub">A few favorites our customers keep coming back for.</p>

                {loading && <p className="loading-text">Loading services...</p>}
                {!loading && services.length === 0 && (
                    <p className="empty-state">No services available right now.</p>
                )}

                <div className="service-grid">
                    {services.map((s) => (
                        <div className="service-card" key={s._id}>
                            <div
                                className="service-photo"
                                style={{
                                    backgroundImage: `url("${assetImages[s.name] ||
                                        '/images/service-placeholder.jpg'
                                        }")`
                                }}
                            />
                            <div className="service-body">
                                <h3>{s.name}</h3>
                                <p className="service-category">{s.category}</p>
                                <div className="service-footer">
                                    <span className="service-price">₹{s.pricePerDay}<small>/day</small></span>
                                    <Link to={`/services/${s._id}`} className="btn-link">View Details →</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="section how-it-works">
                <h2 className="section-title">How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-circle">1</div>
                        <h3>Browse</h3>
                        <p>Explore available salon services and equipment.</p>
                    </div>
                    <div className="step-line" />
                    <div className="step">
                        <div className="step-circle">2</div>
                        <h3>Book</h3>
                        <p>Pick your dates — the price is calculated automatically.</p>
                    </div>
                    <div className="step-line" />
                    <div className="step">
                        <div className="step-circle">3</div>
                        <h3>Enjoy</h3>
                        <p>Use the service, then it's marked returned when you're done.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section testimonials">
                <h2 className="section-title">What Our Customers Say</h2>
                <div className="testimonial-grid">
                    <div className="testimonial-card">
                        <p>"Booking took less than a minute and the pricing was crystal clear. No surprises."</p>
                        <span className="testimonial-name">— Ashika V.</span>
                    </div>
                    <div className="testimonial-card">
                        <p>"Loved how easy it was to track my rental and get reminded before the return date."</p>
                        <span className="testimonial-name">— Priya S.</span>
                    </div>
                    <div className="testimonial-card">
                        <p>"Finally a salon booking system that doesn't feel like a spreadsheet from 2005."</p>
                        <span className="testimonial-name">— Meera K.</span>
                    </div>
                </div>
            </section>

            {/* CTA banner */}
            <section className="cta-banner">
                <h2>Ready to book your next appointment?</h2>
                <Link to="/register" className="btn btn-gold">Get Started Today</Link>
            </section>

        </div>
    );
}

export default Home;