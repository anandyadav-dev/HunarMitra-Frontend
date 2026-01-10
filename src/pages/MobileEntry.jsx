import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const MobileEntry = () => {
    const { language } = useLanguage();
    // Fallback translations if not present in the main translation file yet
    const t = translations[language] || {};
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handleAudioAssist = () => {
        const textToRead = language === 'hi'
            ? "नमस्ते। कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें और ओटीपी भेजें बटन दबाएं।"
            : "Hello. Please enter your 10 digit mobile number and press the Send OTP button.";

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            setError(language === 'hi' ? 'मोबाइल नंबर 10 अंकों का होना चाहिए' : 'Mobile number must be exactly 10 digits');
            return;
        }

        navigate('/verify-otp', { state: { mobile } });
    };

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
            <div className="container" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                {language === 'hi' ? 'नमस्ते' : 'Welcome'} 👋
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                {language === 'hi' ? 'शुरू करने के लिए अपना नंबर दर्ज करें' : 'Enter your number to get started'}
                            </p>
                        </div>
                        <button
                            onClick={handleAudioAssist}
                            className="btn btn-outline"
                            style={{ borderRadius: '50px', padding: '0.5rem 1rem' }}
                        >
                            <Volume2 size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500' }}>
                                {t.mobileNumber || (language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number')}
                            </label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{
                                    padding: '1rem', background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                    display: 'flex', alignItems: 'center', fontSize: '1.1rem', fontWeight: '500'
                                }}>+91</span>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="tel"
                                        placeholder="99846 94243"
                                        value={mobile}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val) && val.length <= 10) {
                                                setMobile(val);
                                                setError('');
                                            }
                                        }}
                                        style={{
                                            width: '100%', padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: 'var(--radius-lg)', 
                                            border: error ? '1px solid red' : '1px solid var(--glass-border)',
                                            background: 'var(--color-bg-tertiary)', 
                                            color: 'var(--color-text-primary)',
                                            fontSize: '1.1rem',
                                            letterSpacing: '1px'
                                        }}
                                    />
                                </div>
                            </div>
                            {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}
                        </div>

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
                                gap: '0.5rem'
                            }}
                        >
                            {t.sendOtp || (language === 'hi' ? 'ओटीपी भेजें' : 'Send OTP')} <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default MobileEntry;
