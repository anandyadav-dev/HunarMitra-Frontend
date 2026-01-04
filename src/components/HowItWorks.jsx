import React from 'react';

const StepCard = ({ number, title, description, icon }) => (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '8rem',
            fontWeight: 'bold',
            color: 'rgba(255,255,255,0.03)',
            zIndex: 0
        }}>
            {number}
        </div>
        <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>{title}</h3>
        <p style={{ fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>{description}</p>
    </div>
);

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Sign Up",
            description: "Create your profile as a worker or contractor in just 2 minutes with simple mobile verification.",
            icon: "📝"
        },
        {
            number: "02",
            title: "Get Verified",
            description: "Complete your KYC and skill verification to build trust and get better opportunities.",
            icon: "✅"
        },
        {
            number: "03",
            title: "Start Connected",
            description: "Workers find jobs daily, and Contractors hire skilled teams instantly. Safe & secure.",
            icon: "🤝"
        }
    ];

    return (
        <section id="how-it-works" className="section" style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="container">
                <div className="text-center" style={{ marginBottom: '4rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>How It Works</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto' }}>Simple steps to get started with India's most trusted labor platform.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    position: 'relative'
                }}>
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
