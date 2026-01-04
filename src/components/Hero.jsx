import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const Hero = () => {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <section className="section" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '80px' // Offset for fixed header
        }}>
            {/* Background Effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                backgroundImage: `linear-gradient(to bottom, rgba(10, 14, 26, 0.8), rgba(10, 14, 26, 0.95)), url('/assets/hero-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}></div>

            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', lg: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }} className="animate-fade-in-up">
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 140, 66, 0.1)',
                        border: '1px solid rgba(255, 140, 66, 0.3)',
                        borderRadius: '50px',
                        color: '#FF8C42',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        marginBottom: '1.5rem'
                    }}>
                        {t.empowering}
                    </div>

                    <h1 style={{ marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        {t.heroTitle}
                    </h1>

                    <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                        {t.heroSubtitle}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', sm: 'row' }} className="hero-buttons">
                        <Link to="/role-selection" className="btn btn-primary-orange" style={{ minWidth: '200px' }}>
                            <span style={{ fontSize: '1.2rem' }}>🛠️</span> {t.registerWorker}
                        </Link>
                        <Link to="/role-selection" className="btn btn-primary-green" style={{ minWidth: '200px' }}>
                            <span style={{ fontSize: '1.2rem' }}>👷‍♂️</span> {t.registerContractor}
                        </Link>
                    </div>

                    <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '3rem', opacity: 0.7 }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>10k+</div>
                            <div style={{ fontSize: '0.9rem' }}>{t.statWorkers}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>500+</div>
                            <div style={{ fontSize: '0.9rem' }}>{t.statContractors}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>20+</div>
                            <div style={{ fontSize: '0.9rem' }}>{t.statCities}</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (min-width: 640px) {
          .hero-buttons { flex-direction: row !important; }
        }
      `}</style>
        </section>
    );
};

export default Hero;
