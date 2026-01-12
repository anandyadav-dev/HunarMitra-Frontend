import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Phone, MapPin, Mail, ShieldCheck, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { useLocationContext } from '../context/LocationContext';
import RegistrationSuccess from '../components/RegistrationSuccess';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerContractor } from '../api/contractor';

const ContractorRegistration = () => {
    const { language } = useLanguage();
    const t = translations[language] || {}; // Fallback if translations not fully loaded
    const location = useLocation();
    const navigate = useNavigate();
    const mobile = location.state?.mobile;

    // Additional fields for backend: licenseNumber, gstNumber, experienceYears, website, address
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        mobile: mobile || '',
        email: '',
        city: '',
        address: '',
        state: 'Delhi', // Default or select
        postalCode: '',
        licenseNumber: '',
        gstNumber: '',
        experienceYears: '',
        website: '',
        workersRequired: [],
        agreed: false
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [userId, setUserId] = useState(null);

    const { city, latitude, longitude } = useLocationContext();

    useEffect(() => {
        if (!mobile) {
            navigate('/register');
        }

        // Check if we should show success immediately (existing user)
        if (location.state?.showSuccess) {
            setIsSuccess(true);
        }

        // Retrieve User ID from storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                setUserId(userObj.id);
                // Pre-fill name if available
                if (userObj.first_name || userObj.last_name) {
                    const fullName = `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim();
                    if (fullName) {
                        setFormData(prev => ({ ...prev, contactPerson: fullName }));
                    }
                }
            } catch (e) {
                console.error("Failed to parse user object", e);
            }
        }
    }, [mobile, navigate, location.state]);

    useEffect(() => {
        if (city && !formData.city) {
            setFormData(prev => ({ ...prev, city }));
        }
    }, [city]);

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = (t.companyName || 'Company Name') + ' is required';
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = (t.contactPerson || 'Contact Person') + ' is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = (t.city || 'City') + ' is required';
        }

        // Basic validation for numbers if provided
        if (formData.experienceYears && isNaN(formData.experienceYears)) {
            newErrors.experienceYears = 'Must be a number';
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            if (!userId) {
                alert("User session not found. Please verify OTP again.");
                navigate('/mobile-entry');
                return;
            }

            // Prepare Payload for Backend
            const payload = {
                user: userId, // Required by serializer as we saw in models
                company_name: formData.companyName,
                license_number: formData.licenseNumber,
                gst_number: formData.gstNumber,
                address: formData.address || (formData.city + ", India"),
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode || "110001",
                website: formData.website,
                experience_years: parseInt(formData.experienceYears) || 0,
                // total_projects, rating are read-only or defaults
            };

            try {
                console.log("Sending Contractor Registration Payload:", payload);
                await registerContractor(payload);
                setIsSuccess(true);
            } catch (err) {
                console.error("Registration Error:", err);
                const errorMsg = err.message || (language === 'hi' ? 'पंजीकरण विफल रहा' : 'Registration Failed');
                setErrors(prev => ({ ...prev, form: errorMsg }));
                alert(errorMsg);
            }
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
                    <div className="glass-card" style={{
                        padding: '3rem',
                        borderTop: '4px solid var(--color-green)',
                        background: 'var(--glass-bg)',
                        color: 'var(--color-text-primary)'
                    }}>
                        <RegistrationSuccess />
                        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                            <p>{t.welcome || 'Welcome'} {formData.contactPerson}!</p>
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
                        <h2 style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>{t.contractorRegTitle || 'Contractor Registration'}</h2>
                        <p style={{ color: 'var(--color-green)' }}>{t.contractorRegSubtitle || 'Partner with us'}</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Company Name */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.companyName || 'Company Name'}</label>
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
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.contactPerson || 'Contact Person'}</label>
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

                            {/* License & GST (Row) */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.licenseNumber || 'License No.'} <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>(Optional)</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <ShieldCheck size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="License No."
                                            value={formData.licenseNumber}
                                            onChange={e => handleChange('licenseNumber', e.target.value)}
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.gstNumber || 'GST No.'} <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>(Optional)</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <ShieldCheck size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="GST No."
                                            value={formData.gstNumber}
                                            onChange={e => handleChange('gstNumber', e.target.value)}
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Experience & Website (Row) */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Experience (Yrs)</label>
                                    <div style={{ position: 'relative' }}>
                                        <CheckSquare size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={formData.experienceYears}
                                            onChange={e => handleChange('experienceYears', e.target.value)}
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: errors.experienceYears ? '1px solid red' : '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                    {errors.experienceYears && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{errors.experienceYears}</p>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Website <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>(Optional)</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="url"
                                            placeholder="https://"
                                            value={formData.website}
                                            onChange={e => handleChange('website', e.target.value)}
                                            style={{
                                                width: '100%', padding: '1rem 1rem 1rem 3rem',
                                                borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                                background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* City */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t.city || 'City'}</label>
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

                            {/* Address */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Address <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>(Optional)</span></label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--color-text-muted)' }} />
                                    <textarea
                                        placeholder="Full Office Address"
                                        value={formData.address}
                                        onChange={e => handleChange('address', e.target.value)}
                                        rows="2"
                                        style={{
                                            width: '100%', padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                                            background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Workers Required */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500' }}>{t.workersRequired || 'Workers Required'}</label>
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
                                    {t.agreeTerms || 'I agree to the terms and conditions'}
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary-green"
                                style={{ width: '100%', padding: '1rem', marginTop: '1rem', color: 'white' }}
                                disabled={!formData.agreed}
                            >
                                {t.registerContractor || 'Register'} <ArrowRight size={20} />
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ContractorRegistration;
