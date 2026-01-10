import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, User, Phone, MapPin, Briefcase, ChevronDown, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { useLocationContext } from '../context/LocationContext';
import RegistrationSuccess from '../components/RegistrationSuccess';
import { useLocation, useNavigate } from 'react-router-dom';

const WorkerRegistration = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const location = useLocation();
    const navigate = useNavigate();
    const mobile = location.state?.mobile;

    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: mobile || '',
        city: '',
        skills: [],
        experience: '',
        jobType: 'Daily Wage',
        aadhaar: '',
        agreed: false
    });

    const { city, latitude, longitude } = useLocationContext();

    useEffect(() => {
        if (!mobile) {
            navigate('/register');
        }
    }, [mobile, navigate]);

    useEffect(() => {
        if (city && !formData.city) {
            setFormData(prev => ({ ...prev, city }));
        }
    }, [city]);

    const [errors, setErrors] = useState({});

    const skillsList = [
        { id: 'electrician', label: t.electrician, icon: '⚡' },
        { id: 'plumber', label: t.plumber, icon: '💧' },
        { id: 'mason', label: t.mason, icon: '⚒️' },
        { id: 'painter', label: t.painter, icon: '🖌️' },
        { id: 'carpenter', label: t.carpenter, icon: '🪚' },
        { id: 'helper', label: t.helper, icon: '🤲' }
    ];

    const handleSkillToggle = (id) => {
        setFormData(prev => {
            const newSkills = prev.skills.includes(id)
                ? prev.skills.filter(s => s !== id)
                : [...prev.skills, id];

            if (newSkills.length > 0 && errors.skills) {
                setErrors(prevErrors => ({ ...prevErrors, skills: '' }));
            }
            return { ...prev, skills: newSkills };
        });
    };

    const handleAudioAssist = () => {
        const textToRead = language === 'hi'
            ? "नमस्ते। हुनरमित्र में आपका स्वागत है। आपका मोबाइल नंबर सत्यापित है। कृपया अपना नाम और काम चुनें। फिर रजिस्टर बटन दबाएं।"
            : "Hello. Welcome to HunarMitra. Your mobile number is verified. To register, please enter your name and select your skills. Then press the register button.";

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t.fullName + ' is required';
        }

        if (formData.skills.length === 0) {
            newErrors.skills = language === 'hi' ? 'कृपया कम से कम एक कौशल चुनें' : 'Please select at least one skill';
        }

        if (!formData.city.trim()) {
            newErrors.city = t.city + ' is required';
        }

        if (!formData.experience) {
            newErrors.experience = language === 'hi' ? 'कृपया अनुभव चुनें' : 'Please select experience';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Prepare Payload for Backend
            const payload = {
                role: 'worker',
                name: formData.name,
                mobile: formData.mobile,
                skills: formData.skills,
                city: formData.city,
                experience: formData.experience,
                jobType: formData.jobType,
                aadhaar: formData.aadhaar, // Optional if captured
                latitude: latitude,
                longitude: longitude,
                termsAccepted: true,
                language: language // sending language preference
            };

            // Simulate API call
            setTimeout(() => {
                console.log("Worker Registration Payload:", JSON.stringify(payload, null, 2));
                setIsSuccess(true);
            }, 500);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    minHeight: '100vh',
                    paddingTop: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-bg-primary)'
                }}
            >
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div className="glass-card" style={{ padding: '3rem', borderTop: '4px solid var(--color-orange)' }}>
                        <RegistrationSuccess />
                        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                            <p>{t.welcome} {formData.name}!</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

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
                                        onChange={e => handleChange('name', e.target.value)}
                                        style={{
                                            width: '100%', padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: 'var(--radius-lg)', border: errors.name ? '1px solid red' : '1px solid var(--glass-border)',
                                            background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                        }}
                                    />
                                </div>
                                {errors.name && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.name}</p>}
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
                                                border: `1px solid ${formData.skills.includes(skill.id) ? 'var(--color-orange)' : (errors.skills ? 'red' : 'var(--glass-border)')}`,
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
                                {errors.skills && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.skills}</p>}
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
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.experience}</label>
                                    <select
                                        value={formData.experience}
                                        onChange={e => handleChange('experience', e.target.value)}
                                        style={{
                                            width: '100%', padding: '1rem', height: '54px',
                                            borderRadius: 'var(--radius-lg)', border: errors.experience ? '1px solid red' : '1px solid var(--glass-border)',
                                            background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)', appearance: 'none'
                                        }}
                                    >
                                        <option value="">Select</option>
                                        <option value="0-1">0-1 {t.years}</option>
                                        <option value="2-5">2-5 {t.years}</option>
                                        <option value="5+">5+ {t.years}</option>
                                    </select>
                                    {errors.experience && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.experience}</p>}
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
                                {t.registerWorker} <ArrowRight size={20} />
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default WorkerRegistration;
