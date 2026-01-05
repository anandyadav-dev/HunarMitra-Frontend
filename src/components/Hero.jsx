import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const targetRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    // Parallax & Animations
    const yText = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={targetRef}
            style={{ height: '200vh', position: 'relative' }}
        >
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                paddingTop: '80px', // Adjusted back as we handle overlap via responsiveness in CSS/JS
                justifyContent: 'center'
            }}>
                {/* Dynamic Background */}
                <motion.div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    y: bgY,
                    backgroundImage: `linear-gradient(to bottom, rgba(10, 14, 26, 0.6), rgba(10, 14, 26, 0.95)), url('/assets/hero-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    {/* Floating Particles/Orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="animate-float"
                                style={{
                                    position: 'absolute',
                                    width: `${300 + i * 150}px`,
                                    height: `${300 + i * 150}px`,
                                    borderRadius: '50%',
                                    background: i % 2 === 0 ? 'rgba(255, 107, 44, 0.08)' : 'rgba(46, 204, 113, 0.04)',
                                    top: `${10 + i * 30}%`,
                                    left: `${i * 30}%`,
                                    filter: 'blur(80px)',
                                    zIndex: -1,
                                    animationDelay: `${i * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                <div className="container" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    alignItems: 'center',
                    width: '100%',
                    position: 'relative',
                    zIndex: 10,
                    height: '100%',
                    paddingTop: '60px' // Mobile safe area
                }}>
                    <motion.div
                        style={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            textAlign: 'center',
                            opacity,
                            y: yText,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '0.6rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '50px',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--color-orange-light)',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                marginBottom: '2rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            {t.empowering}
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-display text-glow"
                            style={{
                                marginBottom: '1.5rem',
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                color: 'white',
                                background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: '1.2'
                            }}
                        >
                            {t.heroTitle}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{
                                fontSize: '1.15rem',
                                marginBottom: '2.5rem',
                                maxWidth: '800px',
                                margin: '0 auto 2.5rem auto',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.6,
                                padding: '0 1rem'
                            }}
                        >
                            {t.heroSubtitle}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%'
                            }}
                            className="hero-buttons"
                        >
                            <Link to="/role-selection" className="btn btn-primary-orange btn-shine" style={{ minWidth: '240px', padding: '1.1rem 2rem', fontSize: '1.15rem' }}>
                                <span style={{ fontSize: '1.4rem' }}>🛠️</span> {t.registerWorker}
                            </Link>
                            <Link to="/role-selection" className="glass-card" style={{
                                minWidth: '240px',
                                padding: '1.1rem 2rem',
                                border: '1px solid rgba(46, 204, 113, 0.4)',
                                color: 'white',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                borderRadius: 'var(--radius-lg)',
                                fontWeight: '600',
                                fontSize: '1.15rem',
                                textDecoration: 'none',
                                background: 'rgba(30, 132, 73, 0.1)',
                                transition: 'all 0.3s ease'
                            }}>
                                <span style={{ fontSize: '1.4rem' }}>👷‍♂️</span> {t.registerContractor}
                            </Link>
                        </motion.div>

                        {/* Stats - Staggered in Glass Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="glass-bar"
                            style={{
                                marginTop: '4rem',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                gap: 'clamp(2rem, 5vw, 6rem)',
                                alignItems: 'center'
                            }}
                        >
                            {[
                                { value: '10k+', label: t.statWorkers },
                                { value: '500+', label: t.statContractors },
                                { value: '20+', label: t.statCities }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    style={{ textAlign: 'center' }}
                                >
                                    <div className="text-gradient-orange" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.2rem' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                <style>{`
                    @media (min-width: 640px) {
                        .hero-buttons { flex-direction: row !important; }
                    }
                `}</style>
            </div>
        </section>
    );
};

export default Hero;
