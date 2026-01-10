import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Phone, MapPin, Mail, ShieldCheck, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { useLocationContext } from '../context/LocationContext';
import RegistrationSuccess from '../components/RegistrationSuccess';
import { useLocation, useNavigate } from 'react-router-dom';

const ContractorRegistration = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const location = useLocation();
    const navigate = useNavigate();
    const mobile = location.state?.mobile;

    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        mobile: mobile || '',
        email: '',
        city: '',
        workersRequired: [],
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = t.companyName + ' is required';
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = t.contactPerson + ' is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = t.city + ' is required';
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

    const handleWorkerTypeToggle = (type) => {
        setFormData(prev => {
            const current = prev.workersRequired || [];
            if (current.includes(type)) {
                return { ...prev, workersRequired: current.filter(t => t !== type) };
            } else {
                return { ...prev, workersRequired: [...current, type] };
            }
        });
        if (errors.workersRequired) {
            setErrors(prev => ({ ...prev, workersRequired: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Prepare Payload for Backend
            const payload = {
                role: 'contractor',
                companyName: formData.companyName,
                contactPerson: formData.contactPerson,
                mobile: formData.mobile,
                email: formData.email, // If captured, currently empty string in state initial
                city: formData.city,
                workersRequired: formData.workersRequired,
                latitude: latitude,
                longitude: longitude,
                termsAccepted: true,
                language: language
            };

            // Simulate API call
            setTimeout(() => {
                console.log("Contractor Registration Payload:", JSON.stringify(payload, null, 2));
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
                    <div className="glass-card" style={{ padding: '3rem', borderTop: '4px solid var(--color-green)' }}>
                        <RegistrationSuccess />
                        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                            <p>{t.welcome} {formData.contactPerson}!</p>
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
                <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid var(--color-green)' }}>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>{t.contractorRegTitle}</h2>
                        <p style={{ color: 'var(--color-green)' }}>{t.contractorRegSubtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit}>

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
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mason', 'Welder'].map(skill => (
                                        <span
                                            key={skill}
                                            onClick={() => handleWorkerTypeToggle(skill)}
                                            className="btn-outline"
                                            style={{
                                                padding: '0.6rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                border: formData.workersRequired.includes(skill) ? '1px solid var(--color-green)' : '1px solid var(--glass-border)',
                                                background: formData.workersRequired.includes(skill) ? 'var(--color-green)' : 'var(--color-bg-tertiary)',
                                                color: formData.workersRequired.includes(skill) ? '#fff' : 'var(--color-text-primary)',
                                                transition: 'all 0.2s',
                                                fontWeight: formData.workersRequired.includes(skill) ? '600' : '400'
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                {errors.workersRequired && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.workersRequired}</p>}
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
                                {t.registerContractor} <ArrowRight size={20} />
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ContractorRegistration;
