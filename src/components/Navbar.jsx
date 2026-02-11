import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/images/revita-logo.png';

export function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id) => {
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

  return (
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
        }}>
            <img src={logo} alt="Revita Logo" style={{ height: '32px' }} />
            Revita
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: '500' }}>
            <Link to="/" style={{ color: 'var(--color-text)' }}>{t('nav.home')}</Link>
            <span 
                onClick={() => handleScroll('products')} 
                style={{ color: 'var(--color-text)', cursor: 'pointer' }}
            >
                {t('nav.products')}
            </span>
            <Link to="/mission" style={{ color: 'var(--color-text)' }}>{t('nav.mission')}</Link>
        </div>
        
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
    </nav>
  );
}
