import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#05080f',
            paddingTop: '5rem',
            paddingBottom: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>

                    {/* Brand Column */}
                    <div style={{ maxWidth: '300px' }}>
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
                            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                Hunar<span style={{ color: '#FF8C42' }}>Mitra</span>
                            </span>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Empowering India's workforce with digital tools for better livelihood. Connect, work, and grow with HunarMitra.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {['Home', 'About Us', 'Services', 'Pricing', 'Safety'].map(item => (
                                <li key={item}>
                                    <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}
                                        onMouseEnter={e => e.target.style.color = 'var(--color-orange)'}
                                        onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Grievance Officer'].map(item => (
                                <li key={item}>
                                    <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}
                                        onMouseEnter={e => e.target.style.color = 'var(--color-orange)'}
                                        onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                <span>📧</span> support@hunarmitra.com
                            </li>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                <span>📞</span> +91 98765 43210
                            </li>
                            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
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
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem'
                }}>
                    <p>© {new Date().getFullYear()} HunarMitra Technologies Pvt Ltd. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map(social => (
                            <a key={social} href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>{social}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
