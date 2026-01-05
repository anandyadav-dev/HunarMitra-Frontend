import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

import heroConnect from '../assets/images/hero_connect.png';
import heroVerify from '../assets/images/hero_verify.png';
import heroPayment from '../assets/images/hero_payment.png';

// Section Content Data
// Section Content Data
// NOTE: We cannot easily use the hook inside this constant definition. 
// We will modify the usage inside the component or move this data inside the component.
// Best approach: Move heroSections inside the component or specific text component to access `t`.
// However, since it is an array used in rendering, let's wrap the data creation in a memo or hook.
// For now, let's modify the TextSection to accept translated strings or use ids to look them up?
// Actually, easier refactor: Move the data array inside the Hero component or a custom hook.

const getHeroSections = (t) => [
    {
        id: 1,
        title: t('heroTitle'), // "Connect with Skilled Labor" -> close match in translations? "Connecting Skilled Workers with..."
        subtitle: t('heroSubtitle'), // "India's efficient marketplace..." -> "HunarMitra helps you..."
        desc: t('empowering'), // Using available keys or we need to add new keys. 
        // The existing translations.js has different text than Hero.jsx currently has. 
        // I will use valid keys from translations.js to ensure it works, even if text changes slightly, or I should have updated translations.js first.
        // Let's check translations.js content again.
        // translations.js has: heroTitle, heroSubtitle, empowering.
        // Hero.jsx has: "Connect with Skilled Labor", "India's efficient marketplace...", etc.
        // The texts are DIFFERENT. I should probably add the specific Hero texts to translations.js to preserve the current content, OR use the existing translations.
        // Given the user wants to FIX the translator, using the keys that EXIST in translations.js is the safest bet to prove it works.
        // But the visuals might change. 
        // Let's assume the user wants the CURRENT Hero text translated. 
        // I will update translations.js FIRST to include the specific Hero text keys if I want to keep exact text, 
        // OR I will just map to the existing keys if they are close enough.
        // Looking at translations.js, it seems generic.
        // Let's update Hero.jsx to use the Existing keys for now to demonstrate functionality, as that is the specific request ("translator work nahi kar raha").
        image: heroConnect,
        color: "from-orange-500 to-red-500"
    },
    {
        id: 2,
        title: t('contractorBenefits1'), // "Verified & Trusted" -> "Hire skilled labor"? No.
        subtitle: t('contractorBenefits3'),
        desc: t('heroSubtitle'),
        image: heroVerify,
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 3,
        title: t('contractorBenefits2'),
        subtitle: t('contractorBenefits3'),
        desc: t('heroSubtitle'),
        image: heroPayment,
        color: "from-green-500 to-emerald-500"
    }
];

// Wait, this is messy. The best way is to update translations.js to match Hero.jsx OR update Hero.jsx to use keys that make sense.
// Let's look at the plan. "Use the t() helper to translate static text in the Hero section".
// I'll proceed with moving the array inside the component and using `t`. I will use temporary strings if keys don't exist, but that won't translate.
// So I MUST add the keys to translations.js first for the BEST result.
// However, I am in the middle of tool calls.
// Let's modify Hero.jsx to accept `t` and use the keys that are clearly available, or pass strings.
// Actually, I'll update Hero.jsx to use `t` and assume keys for the current text, and then I will update translations.js to include those keys. This is a solid plan.

// Hero.jsx keys to add:
// hero_slide1_title, hero_slide1_subtitle, hero_slide1_desc
// hero_slide2_title, hero_slide2_subtitle, hero_slide2_desc
// hero_slide3_title, hero_slide3_subtitle, hero_slide3_desc

// Step 1: Update translations.js with NEW keys.
// Step 2: Update Hero.jsx to use those keys.


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
    const { t } = useLanguage(); // Make sure to import useLanguage if not imported, or pass it down? 
    // Actual component structure check: imports are at top. Need to make sure useLanguage is imported.
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Section Content Data
    const heroSections = [
        {
            id: 1,
            title: t('hero_slide1_title'),
            subtitle: t('hero_slide1_subtitle'),
            desc: t('hero_slide1_desc'),
            image: heroConnect,
            color: "from-orange-500 to-red-500"
        },
        {
            id: 2,
            title: t('hero_slide2_title'),
            subtitle: t('hero_slide2_subtitle'),
            desc: t('hero_slide2_desc'),
            image: heroVerify,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: 3,
            title: t('hero_slide3_title'),
            subtitle: t('hero_slide3_subtitle'),
            desc: t('hero_slide3_desc'),
            image: heroPayment,
            color: "from-green-500 to-emerald-500"
        }
    ];

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
