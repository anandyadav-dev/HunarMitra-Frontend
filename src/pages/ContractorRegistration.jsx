import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Phone, MapPin, Mail, ShieldCheck, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { useLocationContext } from '../context/LocationContext';
import RegistrationSuccess from '../components/RegistrationSuccess';

const ContractorRegistration = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        mobile: '',
        email: '',
        city: '',
        agreed: false
    });

    const { city } = useLocationContext();

    useEffect(() => {
        if (city && !formData.city) {
            setFormData(prev => ({ ...prev, city }));
        }
    }, [city]);

    const [errors, setErrors] = useState({});

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

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

    const validateForm = () => {
        const newErrors = {};

        // Company Name validation
        if (!formData.companyName.trim()) {
            newErrors.companyName = t.companyName + ' is required';
        }

        // Contact Person validation
        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = t.contactPerson + ' is required';
        }

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = language === 'hi' ? 'मोबाइल नंबर 10 अंकों का होना चाहिए' : 'Mobile number must be exactly 10 digits';
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = t.city + ' is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for the field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (validateForm()) {
                // Simulate OTP sending
                setStep(2);
            }
        } else if (step === 2) {
            // Verify OTP
            const enteredOtp = otp.join('');
            if (enteredOtp === '1234') {
                setStep(3); // Success Step
            } else {
                setError(t.invalidOtp);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
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
            <div className="container" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid var(--color-green)' }}>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>{t.contractorRegTitle}</h2>
                        <p style={{ color: 'var(--color-green)' }}>{t.contractorRegSubtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                {/* Company Name */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.companyName}</label>
                                    <div style={{ position: 'relative' }}>
                                        <Building2 size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Sharma Constructions"
                                            value={formData.companyName}
                                            onChange={e => handleChange('companyName', e.target.value)}
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: errors.companyName ? '1px solid red' : '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                    {errors.companyName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.companyName}</p>}
                                </div>

                                {/* Contact Person */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.contactPerson}</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={formData.contactPerson}
                                            onChange={e => handleChange('contactPerson', e.target.value)}
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: errors.contactPerson ? '1px solid red' : '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                    {errors.contactPerson && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.contactPerson}</p>}
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.mobileNumber}</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <span style={{
                                            padding: '1rem', background: 'var(--color-bg-tertiary)',
                                            borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)'
                                        }}>+91</span>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                            <input
                                                type="tel"
                                                placeholder="99846 94243"
                                                value={formData.mobile}
                                                onChange={e => handleChange('mobile', e.target.value)}
                                                style={{
                                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                    borderRadius: 'var(--radius-lg)', border: errors.mobile ? '1px solid red' : '1px solid var(--glass-border)',
                                                    background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {errors.mobile && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.mobile}</p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.city}</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="Project Location"
                                            value={formData.city}
                                            onChange={e => handleChange('city', e.target.value)}
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: errors.city ? '1px solid red' : '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                    {errors.city && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.city}</p>}
                                </div>

                                {/* Workers Required */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500' }}>{t.workersRequired}</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {[t.electrician, t.plumber, t.mason, t.painter, t.carpenter].map(skill => (
                                            <span
                                                key={skill}
                                                className="btn-outline"
                                                style={{
                                                    padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                                                    background: 'var(--color-bg-tertiary)'
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Terms */}
                                <div
                                    onClick={() => setFormData(prev => ({ ...prev, agreed: !prev.agreed }))}
                                    style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    {formData.agreed ? <CheckSquare color="var(--color-green)" /> : <Square color="var(--color-text-muted)" />}
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                        {t.agreeTerms}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary-green"
                                    style={{ width: '100%', padding: '1rem', marginTop: '1rem', color: 'white' }}
                                    disabled={!formData.agreed}
                                >
                                    {t.sendOtp} <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : step === 2 ? (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                                <h3 style={{ marginBottom: '1rem' }}>{t.enterOtp}</h3>
                                <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                                    {t.otpSentTo} {formData.mobile}
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            style={{
                                                width: '50px', height: '50px', textAlign: 'center', fontSize: '1.5rem',
                                                borderRadius: '12px', border: error ? '1px solid red' : '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    ))}
                                </div>

                                {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                                <button
                                    type="submit"
                                    className="btn btn-primary-green"
                                    style={{ width: '100%', marginBottom: '1rem', color: 'white' }}
                                >
                                    {t.verifyComplete}
                                </button>

                                <p
                                    onClick={() => {
                                        setStep(1);
                                        setOtp(['', '', '', '']);
                                        setError('');
                                    }}
                                    style={{ cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}
                                >
                                    {t.changeNumber}
                                </p>
                            </div>
                        ) : (
                            <RegistrationSuccess />
                        )}
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ContractorRegistration;
