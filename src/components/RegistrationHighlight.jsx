import React from 'react';
import { motion } from 'framer-motion';

const RegistrationHighlight = () => {
    return (
        <section className="section" id="register" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Gradient */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.03) 0%, transparent 60%)',
                zIndex: -1
            }}></div>

            <div className="container">
                <div className="registration-grid">
                    {/* Worker Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ y: -10 }}
                        className="glass-card role-card"
                    >
                        <div style={{
                            background: 'rgba(255, 140, 66, 0.1)',
                            width: '90px',
                            height: '90px',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            marginBottom: '2rem'
                        }}>
                            👷
                        </div>
                        <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: '800' }}>For Workers</h2>
                        <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
                            Find consistent work and get paid securely with insurance coverage.
                        </p>

                        <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {['Daily job opportunities', 'Skill-based matching', 'Secure payments', 'Insurance benefits'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem' }}>
                                    <div style={{
                                        minWidth: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-orange)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem'
                                    }}>✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button className="btn btn-primary-orange" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                            Join as Worker
                        </button>
                    </motion.div>

                    {/* Contractor Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ y: -10 }}
                        className="glass-card role-card contractor"
                    >
                        <div style={{
                            background: 'rgba(30, 132, 73, 0.1)',
                            width: '90px',
                            height: '90px',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            marginBottom: '2rem'
                        }}>
                            🏗️
                        </div>
                        <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: '800' }}>For Contractors</h2>
                        <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
                            Hire verified skilled labor instantly and manage projects efficiently.
                        </p>

                        <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {['Access to 10k+ verified workers', 'Replace absentee workers instantly', 'Track attendance & payments', 'Project management tools'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem' }}>
                                    <div style={{
                                        minWidth: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-green)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem'
                                    }}>✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button className="btn btn-primary-green" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                            Join as Contractor
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default RegistrationHighlight;
