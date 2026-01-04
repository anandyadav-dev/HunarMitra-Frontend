import React from 'react';

const Features = () => {
    const features = [
        {
            icon: "📍",
            title: "Location-Based Discovery",
            desc: "Find work or workers near you. Smart geolocation matching saves travel time and cost."
        },
        {
            icon: "🛡️",
            title: "Verified Profiles",
            desc: "Every worker and contractor starts with ID verification. Trust is our foundation."
        },
        {
            icon: "⚡",
            title: "Fast Registration",
            desc: "No complex forms. Simple, intuitive mobile-first interface designed for everyone."
        },
        {
            icon: "💬",
            title: "Direct Communication",
            desc: "Chat directly or call. We enable seamless connection between parties."
        },
        {
            icon: "📱",
            title: "Mobile Friendly",
            desc: "Designed for low-end devices and poor network visibility. Works everywhere."
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="text-center" style={{ marginBottom: '4rem' }}>
                    <h2>Why Choose <span style={{ color: '#FF8C42' }}>HunarMitra</span>?</h2>
                    <p>Built for the needs of modern construction and daily wage ecosystem.</p>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1.5rem'
                }}>
                    {features.map((feature, idx) => (
                        <div key={idx} className="glass-card" style={{
                            flex: '1 1 300px',
                            maxWidth: '350px',
                            textAlign: 'center',
                            padding: '2rem 1.5rem',
                            transition: 'transform 0.3s ease'
                            // hover effect is handled in CSS class
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
