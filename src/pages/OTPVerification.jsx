import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const OTPVerification = () => {
    const { language } = useLanguage();
    const t = translations[language] || {};
    const navigate = useNavigate();
    const location = useLocation();
    const mobile = location.state?.mobile;

    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!mobile) {
            navigate('/register');
        }
    }, [mobile, navigate]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp === '1234') {
            navigate('/role-selection', { state: { mobile } });
        } else {
            setError(t.invalidOtp || (language === 'hi' ? 'गलत ओटीपी' : 'Invalid OTP'));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
            <div className="container" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>

                    <div className="text-center" style={{ marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>
                            {t.enterOtp || (language === 'hi' ? 'ओटीपी दर्ज करें' : 'Enter OTP')}
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                            {t.otpSentTo || (language === 'hi' ? 'ओटीपी भेजा गया' : 'OTP sent to')} +91 {mobile}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    style={{
                                        width: '60px', height: '60px', textAlign: 'center', fontSize: '1.5rem',
                                        borderRadius: '12px',
                                        border: error ? '1px solid red' : '1px solid var(--glass-border)',
                                        background: 'var(--color-bg-tertiary)',
                                        color: 'var(--color-text-primary)',
                                        fontWeight: 'bold'
                                    }}
                                />
                            ))}
                        </div>

                        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1.5rem' }}>{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary-orange"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '2rem'
                            }}
                        >
                            {t.verifyComplete || (language === 'hi' ? 'सत्यापित करें' : 'Verify')} <ArrowRight size={20} />
                        </button>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--glass-border)'
                        }}>
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="btn-link"
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.95rem',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem'
                                }}
                            >
                                {t.changeNumber || (language === 'hi' ? 'नंबर बदलें' : 'Change Number')}
                            </button>
                            <button
                                type="button"
                                className="btn-link"
                                style={{
                                    color: 'var(--color-orange)',
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem'
                                }}
                            >
                                <RotateCcw size={16} /> {t.resendOtp || (language === 'hi' ? 'पुनः भेजें' : 'Resend OTP')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default OTPVerification;
