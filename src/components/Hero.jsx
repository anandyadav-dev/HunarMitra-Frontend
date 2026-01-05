import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Section Content Data
const heroSections = [
    {
        id: 1,
        title: "Connect with Skilled Labor",
        subtitle: "India's efficient marketplace for construction talent.",
        desc: "Stop waiting at labor chowks. Find verified carpenters, masons, and electricians instantly. We bridge the gap between skill and opportunity.",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80", // Construction worker/Action
        color: "from-orange-500 to-red-500"
    },
    {
        id: 2,
        title: "Verified & Trusted",
        subtitle: "Safety and reliability you can count on.",
        desc: "Every worker profile is verified with KYC. Contractors are vetted. Build with confidence knowing you have a trustworthy team.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80", // Electrician working
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 3,
        title: "Secure Payments & Growth",
        subtitle: "Digital payments and financial security for all.",
        desc: "Transparent transactions. Workers get paid on time, contractors track expenses easily. Focused on growing India's infrastructure, together.",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80", // Plumber/Fixing
        color: "from-green-500 to-emerald-500"
    }
];

const TextSection = ({ section, setIndex, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            setIndex(index);
        }
    }, [isInView, setIndex, index]);

    return (
        <div ref={ref} style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    background: 'rgba(255, 107, 44, 0.1)',
                    color: 'var(--color-orange)',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255, 107, 44, 0.2)'
                }}>
                    0{section.id} — {section.subtitle}
                </div>
                <h2 className="text-display" style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, #fff, #ccc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {section.title}
                </h2>
                <p style={{
                    fontSize: '1.25rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '2.5rem',
                    maxWidth: '500px'
                }}>
                    {section.desc}
                </p>
                {index === 0 && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/role-selection" className="btn btn-primary-orange btn-shine" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            Get Started
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const Hero = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Smooth progress bar
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} style={{ position: 'relative', background: 'var(--color-bg-primary)' }}>

            {/* Progress Bar */}
            <motion.div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'var(--color-orange)',
                transformOrigin: '0%',
                scaleX,
                zIndex: 100
            }} />

            <div className="container" style={{ position: 'relative' }}>
                <div className="hero-wrapper" style={{ display: 'flex', flexDirection: 'column-reverse' }}>

                    {/* Left Column: Scrolling Text */}
                    <div className="hero-content" style={{ width: '100%', maxWidth: '600px', position: 'relative', zIndex: 10 }}>
                        {heroSections.map((section, index) => (
                            <TextSection key={section.id} section={section} index={index} setIndex={setActiveIndex} />
                        ))}
                    </div>

                    {/* Right Column: Sticky Images */}
                    <div className="hero-visual" style={{
                        position: 'sticky',
                        top: 0,
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: '2rem'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '80%',
                            maxHeight: '700px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            {/* Overlay Gradient */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))',
                                zIndex: 2
                            }} />

                            {heroSections.map((section, index) => (
                                <motion.img
                                    key={section.id}
                                    src={section.image}
                                    alt={section.title}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{
                                        opacity: activeIndex === index ? 1 : 0,
                                        scale: activeIndex === index ? 1 : 1.1
                                    }}
                                    transition={{ duration: 0.7 }}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 1
                                    }}
                                />
                            ))}

                            {/* Floating Stats or Tags on Image */}
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '30px',
                                    zIndex: 3,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <div style={{ color: 'var(--color-orange)', fontWeight: 'bold' }}>{heroSections[activeIndex].subtitle}</div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (min-width: 1024px) {
                    .hero-wrapper {
                        display: flex !important;
                        flex-direction: row !important;
                    }
                    .hero-content {
                        width: 50% !important;
                    }
                    .hero-visual {
                        width: 50% !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                    }
                }
                
                @media (max-width: 1023px) {
                    .hero-visual {
                        position: fixed !important;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 0;
                        opacity: 0.3; /* Dim background on mobile so text is legible */
                        padding: 0 !important;
                        pointer-events: none;
                    }
                    .hero-visual > div {
                        border-radius: 0 !important;
                        height: 100vh !important;
                        max-height: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;
