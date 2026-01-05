import React from 'react';
import { motion } from 'framer-motion';

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <section className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                    style={{ marginBottom: '4rem' }}
                >
                    <h2 className="text-display" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
                        Why Choose <span className="text-gradient-orange">HunarMitra</span>?
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                        Built for the needs of modern construction and daily wage ecosystem.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        justifyItems: 'center'
                    }}
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            className="glass-card"
                            style={{
                                width: '100%',
                                maxWidth: '350px',
                                textAlign: 'center',
                                padding: '3rem 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                cursor: 'default'
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '18px',
                                background: 'rgba(255, 107, 44, 0.1)',
                                color: 'var(--color-orange)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                marginBottom: '1.5rem',
                                boxShadow: '0 4px 15px rgba(255, 107, 44, 0.2)'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: '700' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '1.05rem' }}>
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
