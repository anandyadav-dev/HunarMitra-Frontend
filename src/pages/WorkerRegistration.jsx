import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, User, Phone, MapPin, Briefcase, ChevronDown, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const WorkerRegistration = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const [step, setStep] = useState(1); // 1: Form, 2: OTP
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        city: '',
        skills: [],
        experience: '',
        jobType: 'Daily Wage',
        aadhaar: '',
        agreed: false
    });

    const skillsList = [
        { id: 'electrician', label: t.electrician, icon: '⚡' },
        { id: 'plumber', label: t.plumber, icon: '💧' },
        { id: 'mason', label: t.mason, icon: '⚒️' },
        { id: 'painter', label: t.painter, icon: '🖌️' },
        { id: 'carpenter', label: t.carpenter, icon: '🪚' },
        { id: 'helper', label: t.helper, icon: '🤲' }
    ];

    const handleSkillToggle = (id) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(id)
                ? prev.skills.filter(s => s !== id)
                : [...prev.skills, id]
        }));
    };

    const handleAudioAssist = () => {
        const textToRead = language === 'hi'
            ? "नमस्ते। हुनरमित्र में आपका स्वागत है। रजिस्ट्रेशन के लिए अपना नाम, मोबाइल नंबर और काम चुनें। फिर रजिस्टर बटन दबाएं।"
            : "Hello. Welcome to HunarMitra. To register, please enter your name, mobile number, and select your skills. Then press the register button.";

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            // Simulate OTP sending
            setStep(2);
        } else {
            // Final submission logic
            console.log('Registered:', formData);
            alert('Registration Successful! Welcome to HunarMitra.');
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
                <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid var(--color-orange)' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>{t.workerRegTitle}</h2>
                            <p style={{ color: 'var(--color-orange)' }}>{t.workerRegSubtitle}</p>
                        </div>
                        <button
                            onClick={handleAudioAssist}
                            className="btn btn-outline"
                            style={{ borderRadius: '50px', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            <Volume2 size={18} /> {t.audioAssist}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                {/* Name */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.fullName}</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Rahul Kumar"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
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
                                                placeholder="98765 43210"
                                                value={formData.mobile}
                                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                                required
                                                style={{
                                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                    borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                                    background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500' }}>{t.selectSkills}</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                        {skillsList.map(skill => (
                                            <div
                                                key={skill.id}
                                                onClick={() => handleSkillToggle(skill.id)}
                                                style={{
                                                    padding: '1rem', borderRadius: 'var(--radius-lg)',
                                                    border: `1px solid ${formData.skills.includes(skill.id) ? 'var(--color-orange)' : 'var(--glass-border)'}`,
                                                    background: formData.skills.includes(skill.id) ? 'rgba(255, 107, 44, 0.1)' : 'var(--color-bg-tertiary)',
                                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.5rem' }}>{skill.icon}</span>
                                                <span style={{ fontWeight: formData.skills.includes(skill.id) ? '600' : '400' }}>{skill.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Location & Experience Row */}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.city}</label>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                required
                                                style={{
                                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                    borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                                    background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.experience}</label>
                                        <select
                                            value={formData.experience}
                                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                            style={{
                                                width: '100%', padding: '1rem', height: '54px',
                                                borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)', appearance: 'none'
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="0-1">0-1 {t.years}</option>
                                            <option value="2-5">2-5 {t.years}</option>
                                            <option value="5+">5+ {t.years}</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div
                                    onClick={() => setFormData(prev => ({ ...prev, agreed: !prev.agreed }))}
                                    style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', cursor: 'pointer', marginTop: '0.5rem' }}
                                >
                                    {formData.agreed ? <CheckSquare color="var(--color-orange)" /> : <Square color="var(--color-text-muted)" />}
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                        {t.agreeTerms}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary-orange"
                                    style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                                    disabled={!formData.agreed}
                                >
                                    {t.sendOtp} <ArrowRight size={20} />
                                </button>

                            </div>
                        ) : (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                                <h3 style={{ marginBottom: '1rem' }}>{t.enterOtp}</h3>
                                <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                                    {t.otpSentTo} {formData.mobile}
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength="1"
                                            style={{
                                                width: '50px', height: '50px', textAlign: 'center', fontSize: '1.5rem',
                                                borderRadius: '12px', border: '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary-orange"
                                    style={{ width: '100%', marginBottom: '1rem' }}
                                >
                                    {t.verifyComplete}
                                </button>

                                <p
                                    onClick={() => setStep(1)}
                                    style={{ cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}
                                >
                                    {t.changeNumber}
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default WorkerRegistration;
