import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, Send, CheckCircle, MapPin, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const Contact = () => {
    const { language } = useLanguage();
    const t = translations[language];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t.fullName + " is required";
        if (!formData.email.trim()) {
            newErrors.email = t.emailLabel + " is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = t.mobileNumber + " is required";
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile number must be 10 digits";
        }
        if (!formData.message.trim()) newErrors.message = t.messageLabel + " is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(false);

        if (validate()) {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    subject: '',
                    message: ''
                });
            }, 1500);
        }
    };

    // Shared input styles for dark theme
    const inputStyle = (error) => ({
        width: '100%',
        padding: '1rem 1.25rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        outline: 'none'
    });

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '6rem',
            paddingBottom: '4rem',
            background: 'radial-gradient(circle at top right, rgba(255, 107, 44, 0.05), transparent 40%), radial-gradient(circle at bottom left, rgba(0, 217, 163, 0.05), transparent 40%)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr',
                    gap: '4rem',
                    alignItems: 'start'
                }}>
                    {/* Left Column: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-display" style={{ marginBottom: '1rem', fontSize: '3.5rem' }}>
                            {t.contactTitle}
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '400px' }}>
                            {t.contactSubtitle}. We're here to help you build your future with HunarMitra.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    background: 'rgba(255, 107, 44, 0.1)', color: '#FF6B2C',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Call Us</h3>
                                    <a href="tel:+919984694243" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '1.1rem' }}>+91 99846 94243</a>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    background: 'rgba(0, 217, 163, 0.1)', color: '#00D9A3',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Us</h3>
                                    <a href="mailto:support@hunarmitra.com" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '1.1rem' }}>support@hunarmitra.com</a>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Visit Us</h3>
                                    <p style={{ color: 'var(--color-text-secondary)' }}>Lucknow, UP, India</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card"
                        style={{ padding: '3rem', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        {isSubmitted ? (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-green)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto',
                                    boxShadow: '0 0 30px rgba(0,217,163,0.3)'
                                }}>
                                    <CheckCircle size={40} color="white" />
                                </div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>{t.messageSent}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>We'll get back to you shortly.</p>
                                <button
                                    className="btn btn-primary-orange"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t.fullName}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={inputStyle(errors.name)}
                                            placeholder="John Doe"
                                            onFocus={(e) => e.target.style.borderColor = '#FF6B2C'}
                                            onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}
                                        />
                                        {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t.mobileNumber}</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            style={inputStyle(errors.mobile)}
                                            placeholder="+91 98765 43210"
                                            onFocus={(e) => e.target.style.borderColor = '#FF6B2C'}
                                            onBlur={(e) => e.target.style.borderColor = errors.mobile ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}
                                        />
                                        {errors.mobile && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.mobile}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t.emailLabel}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={inputStyle(errors.email)}
                                        placeholder="john@example.com"
                                        onFocus={(e) => e.target.style.borderColor = '#FF6B2C'}
                                        onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}
                                    />
                                    {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                                </div>

                                <div>
                                    <label style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t.subjectLabel}</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        style={inputStyle()}
                                        placeholder="How can we help?"
                                        onFocus={(e) => e.target.style.borderColor = '#FF6B2C'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t.messageLabel}</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        style={{ ...inputStyle(errors.message), resize: 'none' }}
                                        placeholder="Type your message here..."
                                        onFocus={(e) => e.target.style.borderColor = '#FF6B2C'}
                                        onBlur={(e) => e.target.style.borderColor = errors.message ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}
                                    ></textarea>
                                    {errors.message && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.message}</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary-orange btn-shine"
                                    style={{ padding: '1.2rem', marginTop: '1rem', width: '100%', fontSize: '1.1rem' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span>{t.sending}</span>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                                            <Send size={20} />
                                            {t.sendMessage}
                                        </div>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .container > div {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Contact;
