import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/images/revita-logo.png';

export function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (id) => {
    setIsOpen(false); // Close menu on click
    if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
        <nav className="glass-panel" style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 3rem)',
        maxWidth: '1200px',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
        }}>
            <Link to="/" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                fontWeight: '700', 
                fontSize: '1.5rem', 
                color: 'var(--color-primary)',
                letterSpacing: '-0.03em'
            }} onClick={() => setIsOpen(false)}>
                <img src={logo} alt="Revita Logo" style={{ height: '70px', maxHeight: '100%' }} />
            </Link>

            {/* Desktop Menu */}
            <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: '500' }}>
                <Link to="/" style={{ color: 'var(--color-text)' }}>{t('nav.home')}</Link>
                <span 
                    onClick={() => handleScroll('products')} 
                    style={{ color: 'var(--color-text)', cursor: 'pointer' }}
                >
                    {t('nav.products')}
                </span>
                <Link to="/mission" style={{ color: 'var(--color-text)' }}>{t('nav.mission')}</Link>
                <button 
                    onClick={toggleLang}
                    className="btn btn-outline"
                    style={{ 
                        padding: '0.4rem 0.8rem', 
                        fontSize: '0.8rem', 
                        display: 'flex', 
                        gap: '0.5rem',
                        border: '1px solid #ddd',
                        color: 'var(--color-text)'
                    }}
                >
                    <Globe size={16} />
                    {lang === 'nl' ? 'NL' : 'EN'}
                </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="mobile-menu-btn" style={{ display: 'none', cursor: 'pointer' }} onClick={toggleMenu}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>
        </nav>

        {/* Mobile Nav Overlay */}
        {isOpen && (
            <div className="glass-panel mobile-nav-overlay open" style={{
                position: 'fixed',
                top: 'calc(1.5rem + 80px + 1rem)', // below navbar
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 3rem)',
                maxWidth: '1200px',
                zIndex: 999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '2rem',
                fontWeight: '500',
                fontSize: '1.2rem'
            }}>
                <Link to="/" style={{ color: 'var(--color-text)' }} onClick={() => setIsOpen(false)}>{t('nav.home')}</Link>
                <span 
                    onClick={() => handleScroll('products')} 
                    style={{ color: 'var(--color-text)', cursor: 'pointer' }}
                >
                    {t('nav.products')}
                </span>
                <Link to="/mission" style={{ color: 'var(--color-text)' }} onClick={() => setIsOpen(false)}>{t('nav.mission')}</Link>
                <button 
                    onClick={toggleLang}
                    className="btn btn-outline"
                    style={{ 
                        padding: '0.4rem 0.8rem', 
                        fontSize: '0.9rem', 
                        display: 'flex', 
                        gap: '0.5rem',
                        border: '1px solid #ddd',
                        color: 'var(--color-text)'
                    }}
                >
                    <Globe size={18} />
                    {lang === 'nl' ? 'NL' : 'EN'}
                </button>
            </div>
        )}
    </>
  );
}
