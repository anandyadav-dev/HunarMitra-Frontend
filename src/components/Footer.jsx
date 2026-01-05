import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#05080f',
            color: '#ffffff', // Force white text base
            paddingTop: '5rem',
            paddingBottom: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            width: '100%',
            position: 'relative',
            zIndex: 10
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Reverted to 200px to fit 4 columns on desktop
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>

                    {/* Brand Column */}
                    <div style={{ maxWidth: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'linear-gradient(135deg, #00D9A3 0%, #00B88A 100%)',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0A0E1A',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}>
                                HM
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff' }}>
                                Hunar<span style={{ color: '#FF8C42' }}>Mitra</span>
                            </span>
                        </div>
                        <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Empowering India's workforce with digital tools for better livelihood. Connect, work, and grow with HunarMitra.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {['Home', 'About Us', 'Services', 'Pricing', 'Safety'].map(item => (
                                <li key={item}>
                                    <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}
                                        onMouseEnter={e => e.target.style.color = '#FF6B2C'}
                                        onMouseLeave={e => e.target.style.color = '#9CA3AF'}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Grievance Officer'].map(item => (
                                <li key={item}>
                                    <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}
                                        onMouseEnter={e => e.target.style.color = '#FF6B2C'}
                                        onMouseLeave={e => e.target.style.color = '#9CA3AF'}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: '#ffffff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>
                                <span>📧</span> support@hunarmitra.com
                            </li>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>
                                <span>📞</span>
                                <a href="tel:+919984694243" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    +91 99846 94243
                                </a>
                            </li>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>
                                <span>📍</span> Bangalore, Karnataka, India
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '0.85rem'
                }}>
                    <p>© {new Date().getFullYear()} HunarMitra Technologies Pvt Ltd. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map(social => (
                            <a key={social} href="#" style={{ color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = '#ffffff'}
                                onMouseLeave={e => e.target.style.color = '#6B7280'}
                            >{social}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
