import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({ number, title, description, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="glass-card"
        style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '2.5rem 2rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(255, 107, 44, 0.1)'
        }}>
        <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-10px',
            fontSize: '8rem',
            fontWeight: '900',
            color: 'rgba(255,255,255,0.03)',
            zIndex: 0,
            lineHeight: 1,
            pointerEvents: 'none'
        }}>
            {number}
        </div>
        <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(255, 107, 44, 0.1)',
            color: 'var(--color-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 4px 15px rgba(255, 107, 44, 0.2)'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', position: 'relative', zIndex: 1, fontWeight: '700' }}>{title}</h3>
        <p style={{ fontSize: '1rem', lineHeight: '1.6', position: 'relative', zIndex: 1, color: 'var(--color-text-secondary)' }}>{description}</p>
    </motion.div>
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
        <section id="how-it-works" className="section" style={{ position: 'relative' }}>
            {/* Background glow for ambience */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255, 107, 44, 0.05) 0%, transparent 70%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                    style={{ marginBottom: '4rem' }}
                >
                    <h2 className="text-display" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
                        How It <span className="text-gradient-orange">Works</span>
                    </h2>
                    <p style={{ margin: '0 auto', fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                        Simple steps to get started with India's most trusted labor platform.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    position: 'relative'
                }}>
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} delay={index * 0.2} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
