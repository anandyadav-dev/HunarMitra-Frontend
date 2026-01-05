import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const RegistrationSuccess = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                style={{ display: 'inline-block', marginBottom: '1.5rem' }}
            >
                <CheckCircle size={80} color="var(--color-green)" />
            </motion.div>

            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>{t.registrationSuccess}</h3>
            <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                {t.registrationSuccessSubtitle}
            </p>

            <button
                onClick={() => navigate('/')}
                className="btn btn-primary-green"
                style={{
                    padding: '0.8rem 2rem',
                    borderRadius: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                <Home size={20} /> {t.goHome}
            </button>
        </div>
    );
};

export default RegistrationSuccess;
