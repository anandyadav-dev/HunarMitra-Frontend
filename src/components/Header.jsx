import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Languages, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('kiosk'), path: '#' },
    { name: t('faq'), path: '#' },
    { name: t('contact'), path: '#' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: isScrolled ? '1rem 0' : '1.5rem 0',
        transition: 'all 0.3s ease',
        background: isScrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
        transform: 'translate3d(0, 0, 0)', // Force hardware acceleration for smoother sticky support
        WebkitTransform: 'translate3d(0, 0, 0)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            HM
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--color-text-primary)' }}>
            Hunar<span style={{ color: 'var(--color-orange)' }}>Mitra</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ display: 'none', gap: '2rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  color: 'var(--color-text-secondary)',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
            <button
              onClick={toggleLanguage}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              <Languages size={18} />
              {language === 'en' ? 'HI' : 'EN'}
            </button>

            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => navigate('/role-selection')}
              className="btn btn-primary-orange"
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
            >
              {t('registerNow')}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button - Forced Absolute Position for Visibility */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            position: 'absolute', // Break out of container flow
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', // flex for centering icon
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '0.6rem',
            color: 'var(--color-orange)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          className="mobile-toggle"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--color-bg-secondary)',
          padding: '2rem',
          borderBottom: '1px solid var(--glass-border)',
          animation: 'fadeIn 0.3s ease',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}
              >
                {link.name}
              </Link>
            ))}

            <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
              <button
                onClick={toggleLanguage}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'transparent', border: 'none', color: 'var(--color-text-primary)'
                }}
              >
                <Languages size={20} /> {t('switchLanguage')}
              </button>

              <button
                onClick={toggleTheme}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'transparent', border: 'none', color: 'var(--color-text-primary)'
                }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} {t('switchTheme')}
              </button>
            </div>

            <a href="tel:+919876543210" className="btn btn-outline" style={{ width: '100%', maxWidth: '200px', justifyContent: 'center', border: '1px solid var(--color-orange)', color: 'var(--color-orange)' }}>
              📞 Call Support
            </a>

            <button
              className="btn btn-primary-orange"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/role-selection');
              }}
              style={{ width: '100%', maxWidth: '200px' }}
            >
              {t('registerNow')}
            </button>
          </nav>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
