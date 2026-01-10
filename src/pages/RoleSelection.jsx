import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, HardHat, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const RoleSelection = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const location = useLocation();
    const navigate = useNavigate();
    const mobile = location.state?.mobile;

    useEffect(() => {
        if (!mobile) {
            navigate('/register');
        }
    }, [mobile, navigate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
                minHeight: '100vh',
                paddingTop: '100px',
                paddingBottom: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-primary)'
            }}
        >
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>{t.selectRole}</h1>
                    <p style={{ fontSize: '1.2rem' }}>{t.chooseRole}</p>
                </div>

                <div className="role-selection-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    {/* Worker Card */}
                    <Link to="/register/worker" state={{ mobile }} style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ y: -8, boxShadow: 'var(--shadow-glow-orange)' }}
                            className="glass-card"
                            style={{
                                padding: '3rem',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                border: '1px solid var(--color-orange)',
                                background: 'linear-gradient(145deg, var(--glass-bg), rgba(255, 107, 44, 0.05))'
                            }}
                        >
                            <div style={{
                                width: '80px', height: '80px',
                                borderRadius: '50%',
                                background: 'var(--color-orange)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '2rem',
                                color: 'white'
                            }}>
                                <HardHat size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.iamWorker}</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>{t.iamWorkerDesc}</p>

                            <ul style={{ textAlign: 'left', width: '100%', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>💼 {t.workerBenefits1}</li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>💵 {t.workerBenefits2}</li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>🆔 {t.workerBenefits3}</li>
                            </ul>

                            <div className="btn btn-primary-orange" style={{ width: '100%', marginTop: 'auto' }}>
                                {t.registerWorker} <ChevronRight size={20} />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Contractor Card */}
                    <Link to="/register/contractor" state={{ mobile }} style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ y: -8, boxShadow: 'var(--shadow-glow-green)' }}
                            className="glass-card"
                            style={{
                                padding: '3rem',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                border: '1px solid var(--color-green)',
                                background: 'linear-gradient(145deg, var(--glass-bg), rgba(30, 132, 73, 0.05))'
                            }}
                        >
                            <div style={{
                                width: '80px', height: '80px',
                                borderRadius: '50%',
                                background: 'var(--color-green)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '2rem',
                                color: 'white'
                            }}>
                                <Briefcase size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.iamContractor}</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>{t.iamContractorDesc}</p>

                            <ul style={{ textAlign: 'left', width: '100%', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>👷 {t.contractorBenefits1}</li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>🏢 {t.contractorBenefits2}</li>
                                <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>📈 {t.contractorBenefits3}</li>
                            </ul>

                            <div className="btn btn-primary-green" style={{ width: '100%', marginTop: 'auto', color: 'white' }}>
                                {t.registerContractor} <ChevronRight size={20} />
                            </div>
                        </motion.div>
                    </Link>
                </div>
                <style>{`
                    @media (max-width: 768px) {
                        .role-selection-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t.supportText} <a href="#" style={{ color: 'var(--color-blue)' }}>Support</a></p>
                </div>
            </div>
        </motion.div>
    );
};

export default RoleSelection;
