import React from 'react';

const RegistrationHighlight = () => {
    return (
        <section className="section" id="register" style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                zIndex: -1
            }}></div>

            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem'
                }}>
                    {/* Worker Card */}
                    <div className="glass-card" style={{
                        borderTop: '4px solid var(--color-orange)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            background: 'rgba(255, 140, 66, 0.1)',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            👷
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>For Workers</h2>
                        <p style={{ marginBottom: '2rem' }}>Find consistent work and get paid securely.</p>

                        <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                            {['Daily job opportunities', 'Skill-based matching', 'Secure payments', 'Insurance benefits'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                    <span style={{ color: 'var(--color-orange)' }}>✓</span> {item}
                                </li>
                            ))}
                        </ul>

                        <button className="btn btn-primary-orange" style={{ width: '100%' }}>
                            Join as Worker
                        </button>
                    </div>

                    {/* Contractor Card */}
                    <div className="glass-card" style={{
                        borderTop: '4px solid var(--color-green)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            background: 'rgba(0, 217, 163, 0.1)',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            🏗️
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>For Contractors</h2>
                        <p style={{ marginBottom: '2rem' }}>Hire verified skilled labor for your projects.</p>

                        <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                            {['Access to 10k+ verified workers', 'Replace absentee workers instantly', 'Track attendance & payments', 'Project management tools'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                    <span style={{ color: 'var(--color-green)' }}>✓</span> {item}
                                </li>
                            ))}
                        </ul>

                        <button className="btn btn-primary-green" style={{ width: '100%' }}>
                            Join as Contractor
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegistrationHighlight;
